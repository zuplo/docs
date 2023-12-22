export const appUrl = (_route: string = "/") => {
  const route = `/docs${_route.replace(/^\/docs/, "")}`;

  return `${process.env.ENVIRONMENT_URL || "https://zuplo.com"}${route}`;
}
