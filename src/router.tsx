import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;
