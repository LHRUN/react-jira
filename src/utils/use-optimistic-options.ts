import { QueryKey, useQueryClient } from 'react-query'

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any) => any
) => {
  const queryClient = useQueryClient()

  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    async onMutate(target: any) {
      const previousItems = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old)
      })

      return { previousItems }
    },
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(
        queryKey,
        (context as { previousItems: any }).previousItems
      )
    },
  }
}

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.filter((item: { id: Number }) => target.id !== item.id) || []
  )
export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item: { id: Number }) =>
        target.id === item.id ? { ...item, ...target } : item
      ) || []
  )
export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : []))
