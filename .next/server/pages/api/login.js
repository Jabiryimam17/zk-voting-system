"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/login";
exports.ids = ["pages/api/login"];
exports.modules = {

/***/ "(api-node)/./database/CreateConnection.js":
/*!**************************************!*\
  !*** ./database/CreateConnection.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mysql2_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mysql2/promise */ \"mysql2/promise\");\n // Use promise-based version\nconst pool = mysql2_promise__WEBPACK_IMPORTED_MODULE_0__.createPool({\n    host: process.env.DB_HOST,\n    user: process.env.DB_USER_NAME,\n    password: process.env.DB_PASSWORD,\n    database: process.env.DB_NAME,\n    port: process.env.DB_PORT,\n    waitForConnections: true,\n    connectionLimit: 10\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pool);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL2RhdGFiYXNlL0NyZWF0ZUNvbm5lY3Rpb24uanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBbUMsQ0FBRSw0QkFBNEI7QUFFakUsTUFBTUMsT0FBT0Qsc0RBQWdCLENBQUM7SUFDMUJHLE1BQU1DLFFBQVFDLEdBQUcsQ0FBQ0MsT0FBTztJQUN6QkMsTUFBTUgsUUFBUUMsR0FBRyxDQUFDRyxZQUFZO0lBQzlCQyxVQUFVTCxRQUFRQyxHQUFHLENBQUNLLFdBQVc7SUFDakNDLFVBQVVQLFFBQVFDLEdBQUcsQ0FBQ08sT0FBTztJQUM3QkMsTUFBTVQsUUFBUUMsR0FBRyxDQUFDUyxPQUFPO0lBQ3pCQyxvQkFBb0I7SUFDcEJDLGlCQUFpQjtBQUNyQjtBQUVBLGlFQUFlZixJQUFJQSxFQUFDIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEphYmlyXFxXZWJzdG9ybVByb2plY3RzXFxWb3RpbmdcXGRhdGFiYXNlXFxDcmVhdGVDb25uZWN0aW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBteXNxbCBmcm9tIFwibXlzcWwyL3Byb21pc2VcIjsgIC8vIFVzZSBwcm9taXNlLWJhc2VkIHZlcnNpb25cclxuXHJcbmNvbnN0IHBvb2wgPSBteXNxbC5jcmVhdGVQb29sKHtcclxuICAgIGhvc3Q6IHByb2Nlc3MuZW52LkRCX0hPU1QsXHJcbiAgICB1c2VyOiBwcm9jZXNzLmVudi5EQl9VU0VSX05BTUUsXHJcbiAgICBwYXNzd29yZDogcHJvY2Vzcy5lbnYuREJfUEFTU1dPUkQsXHJcbiAgICBkYXRhYmFzZTogcHJvY2Vzcy5lbnYuREJfTkFNRSxcclxuICAgIHBvcnQ6IHByb2Nlc3MuZW52LkRCX1BPUlQsXHJcbiAgICB3YWl0Rm9yQ29ubmVjdGlvbnM6IHRydWUsXHJcbiAgICBjb25uZWN0aW9uTGltaXQ6IDEwXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcG9vbDsiXSwibmFtZXMiOlsibXlzcWwiLCJwb29sIiwiY3JlYXRlUG9vbCIsImhvc3QiLCJwcm9jZXNzIiwiZW52IiwiREJfSE9TVCIsInVzZXIiLCJEQl9VU0VSX05BTUUiLCJwYXNzd29yZCIsIkRCX1BBU1NXT1JEIiwiZGF0YWJhc2UiLCJEQl9OQU1FIiwicG9ydCIsIkRCX1BPUlQiLCJ3YWl0Rm9yQ29ubmVjdGlvbnMiLCJjb25uZWN0aW9uTGltaXQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api-node)/./database/CreateConnection.js\n");

/***/ }),

/***/ "(api-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Flogin&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Clogin.js&middlewareConfigBase64=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Flogin&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Clogin.js&middlewareConfigBase64=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   routeModule: () => (/* binding */ routeModule)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/pages-api/module.compiled */ \"(api-node)/./node_modules/next/dist/server/route-modules/pages-api/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(api-node)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"(api-node)/./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var _pages_api_login_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages\\api\\login.js */ \"(api-node)/./pages/api/login.js\");\n\n\n\n// Import the userland code.\n\n// Re-export the handler (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_login_js__WEBPACK_IMPORTED_MODULE_3__, 'default'));\n// Re-export config.\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_login_js__WEBPACK_IMPORTED_MODULE_3__, 'config');\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesAPIRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES_API,\n        page: \"/api/login\",\n        pathname: \"/api/login\",\n        // The following aren't used in production.\n        bundlePath: '',\n        filename: ''\n    },\n    userland: _pages_api_login_js__WEBPACK_IMPORTED_MODULE_3__\n});\n\n//# sourceMappingURL=pages-api.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvYnVpbGQvd2VicGFjay9sb2FkZXJzL25leHQtcm91dGUtbG9hZGVyL2luZGV4LmpzP2tpbmQ9UEFHRVNfQVBJJnBhZ2U9JTJGYXBpJTJGbG9naW4mcHJlZmVycmVkUmVnaW9uPSZhYnNvbHV0ZVBhZ2VQYXRoPS4lMkZwYWdlcyU1Q2FwaSU1Q2xvZ2luLmpzJm1pZGRsZXdhcmVDb25maWdCYXNlNjQ9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNFO0FBQzFEO0FBQ21EO0FBQ25EO0FBQ0EsaUVBQWUsd0VBQUssQ0FBQyxnREFBUSxZQUFZLEVBQUM7QUFDMUM7QUFDTyxlQUFlLHdFQUFLLENBQUMsZ0RBQVE7QUFDcEM7QUFDTyx3QkFBd0IseUdBQW1CO0FBQ2xEO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLFlBQVk7QUFDWixDQUFDOztBQUVEIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZXNBUElSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvcGFnZXMtYXBpL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgaG9pc3QgfSBmcm9tIFwibmV4dC9kaXN0L2J1aWxkL3RlbXBsYXRlcy9oZWxwZXJzXCI7XG4vLyBJbXBvcnQgdGhlIHVzZXJsYW5kIGNvZGUuXG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiLi9wYWdlc1xcXFxhcGlcXFxcbG9naW4uanNcIjtcbi8vIFJlLWV4cG9ydCB0aGUgaGFuZGxlciAoc2hvdWxkIGJlIHRoZSBkZWZhdWx0IGV4cG9ydCkuXG5leHBvcnQgZGVmYXVsdCBob2lzdCh1c2VybGFuZCwgJ2RlZmF1bHQnKTtcbi8vIFJlLWV4cG9ydCBjb25maWcuXG5leHBvcnQgY29uc3QgY29uZmlnID0gaG9pc3QodXNlcmxhbmQsICdjb25maWcnKTtcbi8vIENyZWF0ZSBhbmQgZXhwb3J0IHRoZSByb3V0ZSBtb2R1bGUgdGhhdCB3aWxsIGJlIGNvbnN1bWVkLlxuZXhwb3J0IGNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IFBhZ2VzQVBJUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLlBBR0VTX0FQSSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2xvZ2luXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvbG9naW5cIixcbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBhcmVuJ3QgdXNlZCBpbiBwcm9kdWN0aW9uLlxuICAgICAgICBidW5kbGVQYXRoOiAnJyxcbiAgICAgICAgZmlsZW5hbWU6ICcnXG4gICAgfSxcbiAgICB1c2VybGFuZFxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhZ2VzLWFwaS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Flogin&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Clogin.js&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "(api-node)/./pages/api/login.js":
/*!****************************!*\
  !*** ./pages/api/login.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _database_CreateConnection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../database/CreateConnection */ \"(api-node)/./database/CreateConnection.js\");\n/* harmony import */ var _utilities_jwt_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utilities/jwt.js */ \"(api-node)/./utilities/jwt.js\");\n\n\nasync function handler(req, res) {\n    switch(req.method){\n        case \"POST\":\n            {\n                const { email, password } = req.body;\n                const [[user]] = await _database_CreateConnection__WEBPACK_IMPORTED_MODULE_0__[\"default\"].execute(\"SELECT * FROM users where email=? AND password=? AND verified=?\", [\n                    email,\n                    password,\n                    true\n                ]);\n                if (user.verified) {\n                    const token = (0,_utilities_jwt_js__WEBPACK_IMPORTED_MODULE_1__.generate_token)({\n                        email: email,\n                        id: user[\"national_id\"]\n                    });\n                    (0,_utilities_jwt_js__WEBPACK_IMPORTED_MODULE_1__.set_token_cookie)(res, token);\n                    res.status(200).json(\"You have successfully logged in\");\n                } else {\n                    res.status(403).json(\"You are unauthorized\");\n                }\n            }\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL3BhZ2VzL2FwaS9sb2dpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBMEQ7QUFDZ0I7QUFFM0QsZUFBZUcsUUFBUUMsR0FBRyxFQUFFQyxHQUFHO0lBQzVDLE9BQVFELElBQUlFLE1BQU07UUFDaEIsS0FBSztZQUFRO2dCQUNYLE1BQU0sRUFBRUMsS0FBSyxFQUFFQyxRQUFRLEVBQUUsR0FBR0osSUFBSUssSUFBSTtnQkFDcEMsTUFBTSxDQUFDLENBQUNDLEtBQUssQ0FBQyxHQUFHLE1BQU1WLDBFQUFtQixDQUN4QyxtRUFDQTtvQkFBQ087b0JBQU9DO29CQUFVO2lCQUFLO2dCQUV6QixJQUFJRSxLQUFLRSxRQUFRLEVBQUU7b0JBQ2pCLE1BQU1DLFFBQVFaLGlFQUFjQSxDQUFDO3dCQUMzQk0sT0FBT0E7d0JBQ1BPLElBQUlKLElBQUksQ0FBQyxjQUFjO29CQUN6QjtvQkFDQVIsbUVBQWdCQSxDQUFDRyxLQUFLUTtvQkFDdEJSLElBQUlVLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7Z0JBQ3ZCLE9BQU87b0JBQ0xYLElBQUlVLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7Z0JBQ3ZCO1lBQ0Y7SUFDRjtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEphYmlyXFxXZWJzdG9ybVByb2plY3RzXFxWb3RpbmdcXHBhZ2VzXFxhcGlcXGxvZ2luLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlbGVjdGlvbl9kYiBmcm9tIFwiLi4vLi4vZGF0YWJhc2UvQ3JlYXRlQ29ubmVjdGlvblwiO1xuaW1wb3J0IHsgZ2VuZXJhdGVfdG9rZW4sIHNldF90b2tlbl9jb29raWUgfSBmcm9tIFwiLi4vLi4vdXRpbGl0aWVzL2p3dC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gIHN3aXRjaCAocmVxLm1ldGhvZCkge1xuICAgIGNhc2UgXCJQT1NUXCI6IHtcbiAgICAgIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkIH0gPSByZXEuYm9keTtcbiAgICAgIGNvbnN0IFtbdXNlcl1dID0gYXdhaXQgZWxlY3Rpb25fZGIuZXhlY3V0ZShcbiAgICAgICAgXCJTRUxFQ1QgKiBGUk9NIHVzZXJzIHdoZXJlIGVtYWlsPT8gQU5EIHBhc3N3b3JkPT8gQU5EIHZlcmlmaWVkPT9cIixcbiAgICAgICAgW2VtYWlsLCBwYXNzd29yZCwgdHJ1ZV1cbiAgICAgICk7XG4gICAgICBpZiAodXNlci52ZXJpZmllZCkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IGdlbmVyYXRlX3Rva2VuKHtcbiAgICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgICAgaWQ6IHVzZXJbXCJuYXRpb25hbF9pZFwiXSxcbiAgICAgICAgfSk7XG4gICAgICAgIHNldF90b2tlbl9jb29raWUocmVzLCB0b2tlbik7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKFwiWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGxvZ2dlZCBpblwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDAzKS5qc29uKFwiWW91IGFyZSB1bmF1dGhvcml6ZWRcIik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXSwibmFtZXMiOlsiZWxlY3Rpb25fZGIiLCJnZW5lcmF0ZV90b2tlbiIsInNldF90b2tlbl9jb29raWUiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwiZW1haWwiLCJwYXNzd29yZCIsImJvZHkiLCJ1c2VyIiwiZXhlY3V0ZSIsInZlcmlmaWVkIiwidG9rZW4iLCJpZCIsInN0YXR1cyIsImpzb24iXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api-node)/./pages/api/login.js\n");

/***/ }),

/***/ "(api-node)/./utilities/jwt.js":
/*!**************************!*\
  !*** ./utilities/jwt.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   generate_token: () => (/* binding */ generate_token),\n/* harmony export */   remove_token_cookie: () => (/* binding */ remove_token_cookie),\n/* harmony export */   set_token_cookie: () => (/* binding */ set_token_cookie),\n/* harmony export */   verify_token: () => (/* binding */ verify_token)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cookie */ \"cookie\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var dotenv_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! dotenv/config */ \"dotenv/config\");\n\n\n\n\nconst JWT_SECRET = process.env.JWT_SECRET;\nconst MAX_AGE = 60 * 60;\nconst private_key = fs__WEBPACK_IMPORTED_MODULE_2__.readFileSync(\"./keys/private.key\", \"utf8\");\nconst public_key = fs__WEBPACK_IMPORTED_MODULE_2__.readFileSync(\"./keys/public.key\", \"utf8\");\nfunction generate_token(user) {\n    const token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.sign(user, private_key, {\n        algorithm: \"RS256\",\n        expiresIn: MAX_AGE\n    });\n    return token;\n}\nfunction verify_token(token) {\n    try {\n        return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.verify(token, public_key, {\n            algorithms: [\n                \"RS256\"\n            ]\n        });\n    } catch (error) {\n        console.error(\"Token verification failed:\", error);\n        return null;\n    }\n}\nfunction set_token_cookie(res, token) {\n    const cookie = (0,cookie__WEBPACK_IMPORTED_MODULE_1__.serialize)(\"token\", token, {\n        httpOnly: false,\n        secure: \"development\" === \"production\",\n        maxAge: MAX_AGE,\n        path: \"/\"\n    });\n    res.setHeader(\"Set-Cookie\", cookie);\n}\nfunction remove_token_cookie(res) {\n    const cookie = (0,cookie__WEBPACK_IMPORTED_MODULE_1__.serialize)(\"token\", \"\", {\n        httpOnly: true,\n        secure: \"development\" === \"production\",\n        maxAge: -1,\n        expires: new Date(0),\n        path: \"/\"\n    });\n    return res.setHeader(\"Set-Cookie\", cookie);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaS1ub2RlKS8uL3V0aWxpdGllcy9qd3QuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBK0I7QUFFSTtBQUNmO0FBQ0c7QUFFdkIsTUFBTUcsYUFBYUMsUUFBUUMsR0FBRyxDQUFDRixVQUFVO0FBQ3pDLE1BQU1HLFVBQVUsS0FBSztBQUNyQixNQUFNQyxjQUFjTCw0Q0FBZSxDQUFDLHNCQUFzQjtBQUMxRCxNQUFNTyxhQUFhUCw0Q0FBZSxDQUFDLHFCQUFxQjtBQUNqRCxTQUFTUSxlQUFlQyxJQUFJO0lBQ2pDLE1BQU1DLFFBQVFaLDhDQUFRLENBQUNXLE1BQU1KLGFBQWE7UUFDeENPLFdBQVc7UUFDWEMsV0FBV1Q7SUFDYjtJQUNBLE9BQU9NO0FBQ1Q7QUFFTyxTQUFTSSxhQUFhSixLQUFLO0lBQ2hDLElBQUk7UUFDRixPQUFPWixnREFBVSxDQUFDWSxPQUFPSCxZQUFZO1lBQ25DUyxZQUFZO2dCQUFDO2FBQVE7UUFDdkI7SUFDRixFQUFFLE9BQU9DLE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLDhCQUE4QkE7UUFDNUMsT0FBTztJQUNUO0FBQ0Y7QUFFTyxTQUFTRSxpQkFBaUJDLEdBQUcsRUFBRVYsS0FBSztJQUN6QyxNQUFNVyxTQUFTdEIsaURBQVNBLENBQUMsU0FBU1csT0FBTztRQUN2Q1ksVUFBVTtRQUNWQyxRQUFRckIsa0JBQXlCO1FBQ2pDc0IsUUFBUXBCO1FBQ1JxQixNQUFNO0lBQ1I7SUFDQUwsSUFBSU0sU0FBUyxDQUFDLGNBQWNMO0FBQzlCO0FBRU8sU0FBU00sb0JBQW9CUCxHQUFHO0lBQ3JDLE1BQU1DLFNBQVN0QixpREFBU0EsQ0FBQyxTQUFTLElBQUk7UUFDcEN1QixVQUFVO1FBQ1ZDLFFBQVFyQixrQkFBeUI7UUFDakNzQixRQUFRLENBQUM7UUFDVEksU0FBUyxJQUFJQyxLQUFLO1FBQ2xCSixNQUFNO0lBQ1I7SUFDQSxPQUFPTCxJQUFJTSxTQUFTLENBQUMsY0FBY0w7QUFDckMiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcSmFiaXJcXFdlYnN0b3JtUHJvamVjdHNcXFZvdGluZ1xcdXRpbGl0aWVzXFxqd3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGp3dCBmcm9tIFwianNvbndlYnRva2VuXCI7XG5cbmltcG9ydCB7IHNlcmlhbGl6ZSB9IGZyb20gXCJjb29raWVcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBcImRvdGVudi9jb25maWdcIjtcblxuY29uc3QgSldUX1NFQ1JFVCA9IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQ7XG5jb25zdCBNQVhfQUdFID0gNjAgKiA2MDtcbmNvbnN0IHByaXZhdGVfa2V5ID0gZnMucmVhZEZpbGVTeW5jKFwiLi9rZXlzL3ByaXZhdGUua2V5XCIsIFwidXRmOFwiKTtcbmNvbnN0IHB1YmxpY19rZXkgPSBmcy5yZWFkRmlsZVN5bmMoXCIuL2tleXMvcHVibGljLmtleVwiLCBcInV0ZjhcIik7XG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVfdG9rZW4odXNlcikge1xuICBjb25zdCB0b2tlbiA9IGp3dC5zaWduKHVzZXIsIHByaXZhdGVfa2V5LCB7XG4gICAgYWxnb3JpdGhtOiBcIlJTMjU2XCIsXG4gICAgZXhwaXJlc0luOiBNQVhfQUdFLFxuICB9KTtcbiAgcmV0dXJuIHRva2VuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5X3Rva2VuKHRva2VuKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGp3dC52ZXJpZnkodG9rZW4sIHB1YmxpY19rZXksIHtcbiAgICAgIGFsZ29yaXRobXM6IFtcIlJTMjU2XCJdLFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJUb2tlbiB2ZXJpZmljYXRpb24gZmFpbGVkOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldF90b2tlbl9jb29raWUocmVzLCB0b2tlbikge1xuICBjb25zdCBjb29raWUgPSBzZXJpYWxpemUoXCJ0b2tlblwiLCB0b2tlbiwge1xuICAgIGh0dHBPbmx5OiBmYWxzZSxcbiAgICBzZWN1cmU6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIixcbiAgICBtYXhBZ2U6IE1BWF9BR0UsXG4gICAgcGF0aDogXCIvXCIsXG4gIH0pO1xuICByZXMuc2V0SGVhZGVyKFwiU2V0LUNvb2tpZVwiLCBjb29raWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlX3Rva2VuX2Nvb2tpZShyZXMpIHtcbiAgY29uc3QgY29va2llID0gc2VyaWFsaXplKFwidG9rZW5cIiwgXCJcIiwge1xuICAgIGh0dHBPbmx5OiB0cnVlLFxuICAgIHNlY3VyZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiLFxuICAgIG1heEFnZTogLTEsXG4gICAgZXhwaXJlczogbmV3IERhdGUoMCksXG4gICAgcGF0aDogXCIvXCIsXG4gIH0pO1xuICByZXR1cm4gcmVzLnNldEhlYWRlcihcIlNldC1Db29raWVcIiwgY29va2llKTtcbn1cbiJdLCJuYW1lcyI6WyJqd3QiLCJzZXJpYWxpemUiLCJmcyIsIkpXVF9TRUNSRVQiLCJwcm9jZXNzIiwiZW52IiwiTUFYX0FHRSIsInByaXZhdGVfa2V5IiwicmVhZEZpbGVTeW5jIiwicHVibGljX2tleSIsImdlbmVyYXRlX3Rva2VuIiwidXNlciIsInRva2VuIiwic2lnbiIsImFsZ29yaXRobSIsImV4cGlyZXNJbiIsInZlcmlmeV90b2tlbiIsInZlcmlmeSIsImFsZ29yaXRobXMiLCJlcnJvciIsImNvbnNvbGUiLCJzZXRfdG9rZW5fY29va2llIiwicmVzIiwiY29va2llIiwiaHR0cE9ubHkiLCJzZWN1cmUiLCJtYXhBZ2UiLCJwYXRoIiwic2V0SGVhZGVyIiwicmVtb3ZlX3Rva2VuX2Nvb2tpZSIsImV4cGlyZXMiLCJEYXRlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api-node)/./utilities/jwt.js\n");

/***/ }),

/***/ "cookie":
/*!*************************!*\
  !*** external "cookie" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("cookie");

/***/ }),

/***/ "dotenv/config":
/*!********************************!*\
  !*** external "dotenv/config" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mysql2/promise":
/*!*********************************!*\
  !*** external "mysql2/promise" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("mysql2/promise");

/***/ }),

/***/ "next/dist/compiled/next-server/pages-api.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages-api.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages-api.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(api-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Flogin&preferredRegion=&absolutePagePath=.%2Fpages%5Capi%5Clogin.js&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();