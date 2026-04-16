export async function simulateNetwork(factory, delay = 550) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      try {
        resolve(factory());
      } catch (error) {
        reject(error);
      }
    }, delay + Math.floor(Math.random() * 250));
  });
}
