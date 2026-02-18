import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import { useUserInfo } from "./components/userInfo/UserHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { Status, User } from "tweeter-shared";
import { PagedItemView } from "./presenter/PagedItemPresenter";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();


  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route path="feed/:displayedUser" element={<ItemScroller<Status> key={`feed-${displayedUser!.alias}`} featureUrl="/feeds" presenterFactory={(view: PagedItemView<Status>) => new FeedPresenter(view)} itemComponentFactory={(status, index, featureUrl) => <StatusItem key={index} status={status} featurePath={featureUrl} />} />} />
        <Route path="story/:displayedUser" element={<ItemScroller<Status> key={`story-${displayedUser!.alias}`} featureUrl="/story" presenterFactory={(view: PagedItemView<Status>) => new StoryPresenter(view)} itemComponentFactory={(status, index, featureUrl) => <StatusItem key={index} status={status} featurePath={featureUrl} />} />} />
        <Route path="followees/:displayedUser" element={<ItemScroller<User> key={`followees-${displayedUser!.alias}`} featureUrl="/followees" presenterFactory={(view: PagedItemView<User>) => new FolloweePresenter(view)} itemComponentFactory={(user, index, featureUrl) => <UserItem user={user} featurePath={featureUrl} />} />} />
        <Route path="followers/:displayedUser" element={<ItemScroller<User> key={`followers-${displayedUser!.alias}`} featureUrl="/followers" presenterFactory={(view: PagedItemView<User>) => new FollowerPresenter(view)} itemComponentFactory={(user, index, featureUrl) => <UserItem user={user} featurePath={featureUrl} />} />} />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
