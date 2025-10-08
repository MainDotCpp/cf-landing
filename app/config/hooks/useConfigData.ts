import type { UrlConfig } from '@/types/config'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchAvailablePages, fetchConfig, saveConfig } from '@/lib/api/config'

/**
 * 获取配置数据
 */
export function useConfigQuery(path: string) {
  return useQuery({
    queryKey: ['config', path],
    queryFn: () => fetchConfig(path),
    staleTime: 1000 * 60 * 5, // 5分钟内不重新获取
  })
}

/**
 * 保存配置
 */
export function useConfigMutation(path: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<UrlConfig>) => saveConfig(path, data),
    onSuccess: (newConfig) => {
      // 更新缓存
      queryClient.setQueryData(['config', path], newConfig)
      toast.success('配置已保存！')
    },
    onError: (error: Error) => {
      toast.error(`保存失败: ${error.message}`)
    },
  })
}

/**
 * 获取可用页面列表
 */
export function useAvailablePages() {
  return useQuery({
    queryKey: ['pages'],
    queryFn: fetchAvailablePages,
    staleTime: 1000 * 60 * 10, // 10分钟内不重新获取
  })
}
