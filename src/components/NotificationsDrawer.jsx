import React, { useEffect, useRef } from 'react';
import { useAppState } from '../context/AppStateContext';

export default function NotificationsDrawer({ isOpen, onClose }) {
  const { language, notifications, dict } = useAppState();
  const drawerRef = useRef(null);

  // Close on outside click (deferred to next tick to avoid capturing the opening click event)
  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    const handleOutsideClick = (e) => {
      // Check if it's the trigger button or inside the trigger to prevent toggling issue
      const trigger = document.getElementById("notificationsBtn");
      if (trigger && trigger.contains(e.target)) {
        return;
      }
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      if (active) {
        document.addEventListener("click", handleOutsideClick);
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return (
    <aside 
      ref={drawerRef}
      id="notificationsDrawer"
      className={`drawer-panel right-drawer ${isOpen ? 'open' : ''}`}
    >
      <div className="drawer-header">
        <h3 id="txtNotificationsTitle">{dict.txtNotificationsTitle}</h3>
        <button onClick={onClose} className="icon-btn" id="closeNotificationsDrawer" aria-label="Close drawer">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="drawer-body" id="notificationsList" style={{ gap: '12px' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--md-sys-color-outline)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>notifications_off</span>
            <p style={{ marginTop: '8px', fontSize: '13px' }}>
              {language === "FR" ? 'Aucune notification' : 'No notifications yet'}
            </p>
          </div>
        ) : (
          notifications.map(n => {
            let icon = "info";
            if (n.type === "warning") icon = "warning";
            else if (n.type === "promo") icon = "local_offer";

            return (
              <div key={n.id} className={`notification-item ${n.unread ? 'unread' : ''}`}>
                <div className="notif-icon-box">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div className="notif-content">
                  <span className="notif-title">{n.title}</span>
                  <span className="notif-body">{n.body}</span>
                  <span className="notif-time">{n.time}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
