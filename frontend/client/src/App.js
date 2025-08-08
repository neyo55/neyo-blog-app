import React, { Suspense, Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import LoadingSpinner from './components/Common/LoadingSpinner';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

const Home = React.lazy(() => import('./pages/Home'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const SignIn = React.lazy(() => import('./pages/SignIn'));
const CreatePost = React.lazy(() => import('./pages/CreatePost'));
const PostDetail = React.lazy(() => import('./pages/PostDetail'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Profile = React.lazy(() => import('./pages/Profile'));

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1 className="text-center text-2xl mt-8 text-gray-900 dark:text-gray-100">Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

const App = () => (
  <BrowserRouter>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/create-post" element={<CreatePost />} />
                  <Route path="/post/:id" element={<PostDetail />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </BrowserRouter>
);

export default App;










// import React, { Suspense } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Common/Navbar';
// import Footer from './components/Common/Footer';
// import LoadingSpinner from './components/Common/LoadingSpinner';
// import { ThemeProvider } from './contexts/ThemeContext';
// import { AuthProvider } from './contexts/AuthContext';
// import './App.css';

// const Home = React.lazy(() => import('./pages/Home'));
// const SignUp = React.lazy(() => import('./pages/SignUp'));
// const SignIn = React.lazy(() => import('./pages/SignIn'));
// const CreatePost = React.lazy(() => import('./pages/CreatePost'));
// const PostDetail = React.lazy(() => import('./pages/PostDetail'));
// const NotFound = React.lazy(() => import('./pages/NotFound'));

// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <h1 className="text-center text-2xl mt-8">Something went wrong.</h1>;
//     }
//     return this.props.children;
//   }
// }

// const App = () => (
//   <BrowserRouter>
//     <ErrorBoundary>
//       <ThemeProvider>
//         <AuthProvider>
//           <div className="flex flex-col min-h-screen">
//             <Navbar />
//             <main className="flex-grow container mx-auto px-4 py-8">
//               <Suspense fallback={<LoadingSpinner />}>
//                 <Routes>
//                   <Route path="/" element={<Home />} />
//                   <Route path="/signup" element={<SignUp />} />
//                   <Route path="/signin" element={<SignIn />} />
//                   <Route path="/create-post" element={<CreatePost />} />
//                   <Route path="/post/:id" element={<PostDetail />} />
//                   <Route path="*" element={<NotFound />} />
//                 </Routes>
//               </Suspense>
//             </main>
//             <Footer />
//           </div>
//         </AuthProvider>
//       </ThemeProvider>
//     </ErrorBoundary>
//   </BrowserRouter>
// );

// export default App;