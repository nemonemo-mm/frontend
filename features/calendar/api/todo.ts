import { apiClient } from "@/shared/utils/http";
import { TodoRequest, TodoResponse } from "../types/todo.model";

export async function getTeamTodo(
  teamId: number,
  params: {
    start: string;
    end: string;
  }
): Promise<TodoResponse[]> {
  const { data } = await apiClient.get<TodoResponse[]>(
    `/teams/${teamId}/todos`,
    { params }
  );

  return data;
}

export async function getMyTodo(params: {
  start: string;
  end: string;
}): Promise<TodoResponse[]> {
  const { data } = await apiClient.get<TodoResponse[]>(`/me/todos`, { params });

  return data;
}

export async function addTodo(body: TodoRequest): Promise<TodoResponse> {
  const { data } = await apiClient.post<TodoResponse>(`/todos`, body);
  return data;
}

export async function changeTodo(
  todoId: number,
  body: TodoRequest
): Promise<TodoResponse> {
  const { data } = await apiClient.patch<TodoResponse>(
    `/todos/${todoId}`,
    body
  );
  return data;
}

export async function deleteTodo(todoId: number): Promise<{}> {
  const { data } = await apiClient.delete<{}>(`/todos/${todoId}`);
  return data;
}
