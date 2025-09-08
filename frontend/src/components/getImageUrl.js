export const getImageUrl = (path) => {
  const baseUrl = "http://localhost:5000";
  return path ? `${baseUrl}${path}` : `https://images.unsplash.com/photo-1756323968720-76196b4c29c4?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;
};