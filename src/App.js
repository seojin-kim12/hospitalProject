import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import React, { Suspense } from "react";

const Loading = React.lazy(() => import('./pages/Loading'));
const Login = React.lazy(() => import('./pages/Login'));
const Chat = React.lazy(() => import('./pages/Chat'));
const Manual = React.lazy(() => import('./pages/Manual'));
const ManualDetail = React.lazy(() => import('./pages/ManualDetail'));
const MapPage = React.lazy(() => import('./pages/MapPage'));
const Mypage = React.lazy(() => import('./pages/Mypage'));
const Signup = React.lazy(() => import('./pages/Signup'));

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Chat" element={<Chat />} />
            <Route path="/Manual" element={<Manual />} />
            <Route path="/ManualDetail" element={<ManualDetail />} />
            <Route path="/Mypage" element={<Mypage />} />
            <Route path="/Signup" element={<Signup />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
