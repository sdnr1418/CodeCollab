import Navbar from './Navbar'

// Wraps a page with the navbar (props.children pattern from the React lectures).
function MainLayout({ children }) {
  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

export default MainLayout