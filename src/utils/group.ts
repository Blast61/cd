export function groupBy<D, K extends string | number | symbol>(
  data: D[],
  keyFunction: (item: D) => K,
): Record<K, D[]> {
  return data.reduce(
    (groups, item) => {
      const key = keyFunction(item);
      const group = groups[key] || [];
      group.push(item);
      groups[key] = group;
      return groups;
    },
    {} as Record<K, D[]>,
  );
}
