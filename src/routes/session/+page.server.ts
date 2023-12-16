import { fail } from "@sveltejs/kit";

export const actions = {
  login({ cookies, request, route }) {
    const responseJson = { action: `${route.id}?/login` };
    return request
      .formData()
      .then((formData) => {
        const access_token = formData.get("access_token");
        if (
          typeof access_token !== "string" ||
          access_token.length <= 0 ||
          access_token.length >= 256
        ) {
          return fail(400, responseJson);
        }
        cookies.set("access_token", access_token, { path: "/" });
        return responseJson;
      })
      .catch(() => fail(400, responseJson));
  },
  logout({ cookies, route }) {
    const responseJson = { action: `${route.id}?/logout` };
    cookies.delete("access_token", { path: "/" });
    return responseJson;
  },
};
