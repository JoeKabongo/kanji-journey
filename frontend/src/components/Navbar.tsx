const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0  flex justify-between p-5 font-sans font-medium border-b border-gray-200">
      <div>
        <a href="/" className="text-xl">
          ShinKanji
        </a>
      </div>
      <div>
        <ul className="flex space-x-10 content-center">
          <li>
            <a href="/kanjis"> Kanjis </a>
          </li>
          <li>
            <a href="/deck"> My decks </a>
          </li>
          <li>
            <a href="/quiz"> Quiz Zone </a>
          </li>
          <li>
            <a href="/profile max-h-max bg--200">Profile</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
