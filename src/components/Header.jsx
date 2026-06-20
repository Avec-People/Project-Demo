import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../context/AppStateContext';

export default function Header() {
  const {
    language, toggleLanguage,
    theme, toggleTheme,
    hasUnreadNotif, openNotifications, closeNotifications,
    isNotificationsOpen,
    isProfileOpen, setIsProfileOpen,
    dict
  } = useAppState();

  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchWrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleSearchToggle = (e) => {
    e.stopPropagation();
    setSearchExpanded(prev => !prev);
    if (!searchExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchValue("");
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setSearchExpanded(false);
        setSearchValue("");
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-container">
          <img src="/avec_logo.png" alt="AVEC Logo" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <span className="logo-text">AVEC <span className="logo-sub">People</span></span>
        </div>
      </div>

      {/* Expanding Search Bar */}
      <div 
        ref={searchWrapperRef} 
        className={`search-wrapper ${searchExpanded ? 'expanded' : ''}`}
        id="searchWrapper"
      >
        <button 
          onClick={handleSearchToggle} 
          className="search-toggle-btn" 
          id="searchToggleBtn" 
          aria-label="Search"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
        <input 
          ref={searchInputRef}
          type="text" 
          className="search-input" 
          id="searchInput" 
          placeholder={dict.searchPlaceholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          aria-label="Search bar"
        />
      </div>

      <div className="header-actions">
        {/* Language Switch Toggle */}
        <button 
          onClick={toggleLanguage} 
          className="icon-btn text-toggle" 
          id="langToggle" 
          aria-label="Switch Language" 
          title="Switch Language"
        >
          <span className="lang-text current-lang">{language}</span>
          <span className="material-symbols-outlined select-arrow">translate</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className="icon-btn" 
          id="themeToggle" 
          aria-label="Toggle Theme" 
          title="Toggle Theme"
        >
          <span className="material-symbols-outlined" id="themeIcon">
            {theme === "light" ? "dark_mode" : "light_mode"}
          </span>
        </button>

        {/* Notifications Bell */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (isNotificationsOpen) {
              closeNotifications();
            } else {
              openNotifications();
            }
          }} 
          className="icon-btn notifications-btn" 
          id="notificationsBtn" 
          aria-label="Notifications" 
          title="Notifications" 
          style={{ position: 'relative' }}
        >
          <span className="material-symbols-outlined">notifications</span>
          <span 
            className={`notification-badge ${hasUnreadNotif ? '' : 'hidden'}`} 
            id="notifBadge" 
            style={{ 
              position: 'absolute', 
              top: '4px', 
              right: '4px', 
              width: '8px', 
              height: '8px', 
              backgroundColor: 'var(--md-sys-color-error)', 
              borderRadius: '50%' 
            }}
          ></span>
        </button>

        {/* Profile Icon Trigger */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsProfileOpen(prev => !prev);
          }} 
          className="profile-trigger" 
          id="profileTrigger" 
          aria-label="User Profile"
        >
          <div className="avatar-fallback">JD</div>
        </button>
      </div>
    </header>
  );
}
