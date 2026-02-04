import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import GuideListPage from "./components/pages/GuideListPage";
import GuideDetailPage from "./components/pages/GuideDetailPage";
import { PATHS } from "./app/routes/path";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={PATHS.guideList} element={<GuideListPage />} />
        <Route path={PATHS.guideDetail} element={<GuideDetailPage />} />
      </Route>

      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to={PATHS.guideList} replace />} />
    </Routes>
  )
}

export default App
