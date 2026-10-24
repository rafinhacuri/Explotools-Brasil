import type { BaseIssue } from 'valibot'
import { getDotPath } from 'valibot'

function useFormErrors(): {
  errors: Ref<Record<string, string>>
  collect: (issues: BaseIssue<unknown>[]) => void
  clear: () => void
} {
  const errors = ref<Record<string, string>>({})

  function collect(issues: BaseIssue<unknown>[]): void {
    const next: Record<string, string> = {}
    for (const issue of issues) {
      const path = getDotPath(issue)
      if (path && !next[path]) next[path] = issue.message
    }
    errors.value = next
  }

  function clear(): void {
    errors.value = {}
  }

  return { errors, collect, clear }
}

export { useFormErrors }
