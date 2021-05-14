import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { Link } from 'react-router-dom'

import { KanBanScreen } from 'screens/kanban'
import { EpicScreen } from 'screens/epic'

export const ProjectScreen = () => {
  return (
    <div>
      <h1>ProjectScreen</h1>
      <Link to={'kanban'}>看板</Link>
      <Link to={'epic'}>任务组</Link>
      <Routes>
        <Route path={'/kanban'} element={<KanBanScreen />} />
        <Route path={'/epic'} element={<EpicScreen />} />
        <Navigate to={window.location.pathname + '/kanban'} />
      </Routes>
    </div>
  )
}
