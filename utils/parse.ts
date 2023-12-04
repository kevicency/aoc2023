export const splitLines = (input: string, { includeEmpty }: { includeEmpty?: boolean } = {}) => {
  let lines = input.split('\n')

  if (!includeEmpty) {
    lines = lines.filter(Boolean)
  }
  return lines
}
