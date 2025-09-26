
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center  relative">
      {/* Platform Tag */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <span className="px-4 py-2 rounded-full bg-white shadow text-sm font-medium flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-2"></span>
          Team Selection Plugin
        </span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center mt-24">
        <h1 className="text-5xl sm:text-6xl font-black text-center leading-tight mb-2">
          kill the rush,<br />
          <span className="bg-gradient-to-r from-orange-500 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">let the fest go live</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 text-center max-w-2xl">
          Manage registrations, scheduling, scoring, and results — all in one platform. No paperwork, no chaos. Just smooth fests, every time.
        </p>
        <p className="mt-4 text-pink-600 font-semibold text-center">Make Your Fest Alive!</p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            to="/register"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-xl shadow transition-colors border border-yellow-300 flex items-center justify-center text-lg relative"
          >
            Start Free Trial
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-700 text-xl">★</span>
          </Link>
          <Link
            to="/demo"
            className="bg-white hover:bg-gray-50 text-gray-900 font-bold px-8 py-4 rounded-xl shadow border border-gray-200 flex items-center justify-center text-lg"
          >
            View Demo
          </Link>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-8 mt-10 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
            No setup fees
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
            7-day free trial
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span>
            Cancel anytime
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home