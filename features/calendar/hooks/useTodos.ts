import {
  QueryClient,
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addTodo,
  changeTodo,
  changeTodoStatus,
  deleteTodo as deleteTodoRequest,
  getMyTodo,
  getTeamTodo,
} from "../api/todo";
import type {
  TodoRequest,
  TodoResponse,
  TodoStatusRequest,
} from "../types/todo.model";

export type TodoQueryParams = {
  start: string;
  end: string;
};

const hasValidRange = (params: TodoQueryParams) =>
  Boolean(params.start && params.end);

export function useTeamTodos(teamId: number | null, params: TodoQueryParams) {
  const queryKey = [
    "teams",
    teamId ?? "unknown",
    "todos",
    params.start,
    params.end,
  ];
  const enabled =
    typeof teamId === "number" && teamId > 0 && hasValidRange(params);

  return useQuery<TodoResponse[]>({
    queryKey,
    queryFn: () => getTeamTodo(teamId as number, params),
    enabled,
  });
}

export function useMyTodos(params: TodoQueryParams) {
  const queryKey = ["me", "todos", params.start, params.end];
  const enabled = hasValidRange(params);

  return useQuery<TodoResponse[]>({
    queryKey,
    queryFn: () => getMyTodo(params),
    enabled,
  });
}

type UpdateTodoPayload = {
  todoId: number;
  body: TodoRequest;
};

type UpdateTodoStatusPayload = {
  todoId: number;
  body: TodoStatusRequest;
};

type DeleteTodoPayload = {
  todoId: number;
  teamId?: number | null;
};

type TodoCacheSnapshot = Array<[QueryKey, TodoResponse[] | undefined]>;

const snapshotTodoCaches = (queryClient: QueryClient) => ({
  team: queryClient.getQueriesData<TodoResponse[]>({
    queryKey: ["teams"],
    exact: false,
    predicate: (query) => query.queryKey.includes("todos"),
  }),
  me: queryClient.getQueriesData<TodoResponse[]>({
    queryKey: ["me", "todos"],
    exact: false,
  }),
});

const restoreTodoCaches = (
  queryClient: QueryClient,
  snapshot?: { team: TodoCacheSnapshot; me: TodoCacheSnapshot }
) => {
  if (!snapshot) return;

  [...snapshot.team, ...snapshot.me].forEach(([key, data]) => {
    queryClient.setQueryData(key, data);
  });
};

const patchTodoInCache = (
  data: TodoResponse[] | undefined,
  todoId: number,
  body: TodoRequest
) => {
  if (!data) return data;

  return data.map((todo) =>
    todo.id === todoId
      ? {
          ...todo,
          title: body.title,
          description: body.description,
          status: body.status,
          endAt: body.endAt,
          place: body.place,
          url: body.url,
          positionIds: body.positionIds,
        }
      : todo
  );
};

const removeTodoFromCache = (
  data: TodoResponse[] | undefined,
  todoId: number
) => {
  if (!data) return data;
  return data.filter((todo) => todo.id !== todoId);
};

const optimisticallyUpdateTodoCaches = (
  queryClient: QueryClient,
  todoId: number,
  body: TodoRequest
) => {
  queryClient.setQueriesData<TodoResponse[]>(
    {
      queryKey: ["teams"],
      exact: false,
      predicate: (query) => query.queryKey.includes("todos"),
    },
    (old) => patchTodoInCache(old, todoId, body)
  );

  queryClient.setQueriesData<TodoResponse[]>(
    { queryKey: ["me", "todos"], exact: false },
    (old) => patchTodoInCache(old, todoId, body)
  );
};

const optimisticallyDeleteTodoCaches = (
  queryClient: QueryClient,
  todoId: number
) => {
  queryClient.setQueriesData<TodoResponse[]>(
    {
      queryKey: ["teams"],
      exact: false,
      predicate: (query) => query.queryKey.includes("todos"),
    },
    (old) => removeTodoFromCache(old, todoId)
  );

  queryClient.setQueriesData<TodoResponse[]>(
    { queryKey: ["me", "todos"], exact: false },
    (old) => removeTodoFromCache(old, todoId)
  );
};

function invalidateTodoQueries(
  queryClient: QueryClient,
  teamId?: number | null
) {
  if (typeof teamId === "number" && teamId > 0) {
    queryClient.invalidateQueries({
      queryKey: ["teams", teamId, "todos"],
      exact: false,
    });
  } else {
    queryClient.invalidateQueries({
      queryKey: ["teams"],
      exact: false,
    });
  }

  queryClient.invalidateQueries({
    queryKey: ["me", "todos"],
    exact: false,
  });
}

export function useTodoMutations() {
  const queryClient = useQueryClient();

  const createTodo = useMutation({
    mutationFn: (body: TodoRequest) => addTodo(body),
    onSuccess: (_, variables) => {
      invalidateTodoQueries(queryClient, variables.teamId);
    },
  });

  const updateTodo = useMutation({
    mutationFn: (payload: UpdateTodoPayload) =>
      changeTodo(payload.todoId, payload.body),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["teams"],
        exact: false,
        predicate: (query) => query.queryKey.includes("todos"),
      });
      await queryClient.cancelQueries({
        queryKey: ["me", "todos"],
        exact: false,
      });

      const snapshot = snapshotTodoCaches(queryClient);
      optimisticallyUpdateTodoCaches(queryClient, variables.todoId, variables.body);
      return { snapshot };
    },
    onError: (_, __, context) => {
      restoreTodoCaches(queryClient, context?.snapshot);
    },
    onSettled: (_, __, variables) => {
      invalidateTodoQueries(queryClient, variables.body.teamId);
    },
  });

  const updateTodoStatus = useMutation({
    mutationFn: (payload: UpdateTodoStatusPayload) =>
      changeTodoStatus(payload.todoId, payload.body),
    onSuccess: (res, _) => {
      invalidateTodoQueries(queryClient, res.id);
    },
  });

  const deleteTodo = useMutation({
    mutationFn: (payload: DeleteTodoPayload) =>
      deleteTodoRequest(payload.todoId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["teams"],
        exact: false,
        predicate: (query) => query.queryKey.includes("todos"),
      });
      await queryClient.cancelQueries({
        queryKey: ["me", "todos"],
        exact: false,
      });

      const snapshot = snapshotTodoCaches(queryClient);
      optimisticallyDeleteTodoCaches(queryClient, variables.todoId);
      return { snapshot };
    },
    onError: (_, __, context) => {
      restoreTodoCaches(queryClient, context?.snapshot);
    },
    onSettled: (_, __, variables) => {
      invalidateTodoQueries(queryClient, variables.teamId);
    },
  });

  return {
    createTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
  };
}
