import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addTodo,
  changeTodo,
  deleteTodo as deleteTodoRequest,
  getMyTodo,
  getTeamTodo,
} from "../api/todo";
import type { TodoRequest, TodoResponse } from "../types/todo.model";

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

type DeleteTodoPayload = {
  todoId: number;
  teamId?: number | null;
};

function invalidateTodoQueries(queryClient: QueryClient, teamId?: number | null) {
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
    onSuccess: (_, variables) => {
      invalidateTodoQueries(queryClient, variables.body.teamId);
    },
  });

  const deleteTodo = useMutation({
    mutationFn: (payload: DeleteTodoPayload) =>
      deleteTodoRequest(payload.todoId),
    onSuccess: (_, variables) => {
      invalidateTodoQueries(queryClient, variables.teamId);
    },
  });

  return {
    createTodo,
    updateTodo,
    deleteTodo,
  };
}
