export function groupBy(data, keyFunction) {
  return data.reduce((groups, item) => {
    const key = keyFunction(item);
    const group = groups[key] || [];
    group.push(item);
    groups[key] = group;
    return groups;
  }, {});
}
