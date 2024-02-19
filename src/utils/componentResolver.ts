export function VantResolver(): ComponentResolver | any {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith('ihec')) {
        const partialName = name.slice(3)
        return {
          name: partialName,
          from: `@/components/ihec/`, 
        }
      }
    },
  }