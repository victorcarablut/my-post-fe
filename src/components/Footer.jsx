import React from 'react';

export default function Footer() {

  const dateYear = new Date().getFullYear();

  return (
    <footer>
      <div className="text-center text-muted">
        <p><small>Copyright © {dateYear}, All rights reserved.</small></p>
        <a className="footer-url" href="https://code.victorcarablut.com" target="_blank" rel="noreferrer"><small>code.victorcarablut.com</small></a>
      </div>
    </footer>
  )
}