import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App";
import { Catalog } from "../pages/Catalog/Catalog";
import { Favorites } from "../pages/Favorites/Favorites";
import { Home } from "../pages/Home/Home";
import { Library } from "../pages/Library/Library";
import { Movie } from "../pages/Movie/Movie";
import { NotFound } from "../pages/NotFound/NotFound";
import { Picker } from "../pages/Picker/Picker";
import { Profile } from "../pages/Profile/Profile";
import { Person } from "../pages/Person/Person";
import { Studio } from "../pages/Studio/Studio";
import { FestivalEvent } from "../pages/Festivals/FestivalEvent";
import { Festivals } from "../pages/Festivals/Festivals";
import { CineVaultProvider } from "./CineVaultProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CineVaultProvider>
        <App />
      </CineVaultProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "catalog", element: <Catalog /> },
      { path: "movie/:id", element: <Movie /> },
      { path: "picker", element: <Picker /> },
      { path: "library", element: <Library /> },
      { path: "favorites", element: <Favorites /> },
      { path: "profile", element: <Profile /> },
      { path: "person/:id", element: <Person /> },
      { path: "studio/:id", element: <Studio /> },
      { path: "festivals", element: <Festivals /> },
      { path: "festivals/:eventId", element: <FestivalEvent /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
