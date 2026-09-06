export const PERFORMANCE = {
  measureRender: (componentName: string) => {
    if (typeof window !== 'undefined') {
      const start = performance.now();
      return () => {
        const duration = performance.now() - start;
        console.log(`⏱️ ${componentName} rendered in ${duration.toFixed(2)}ms`);
        if (duration > 100) {
          console.warn(`⚠️ ${componentName} slow render: ${duration.toFixed(2)}ms`);
        }
      };
    }
    return () => {};
  },

  reportWebVitals: (metric: any) => {
    console.log(`📊 ${metric.name}: ${metric.value}`);
  },

  getOptimizedImageUrl: (url: string, width: number, height: number) => {
    return url;
  }
};
