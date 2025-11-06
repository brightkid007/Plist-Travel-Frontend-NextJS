
'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminUsers, getAdminBookings } from "@/helpers/backend_helper";
import { getTransactions, getConversations } from "@/helpers/backend_helper";
import { useAuth } from "@/contexts/AuthContext";
import MainMenu from "../MainMenu";
import MobileMenu from "../MobileMenu";

const HeaderDashBoard = () => {
  const [navbar, setNavbar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState({ users: [], bookings: [], payments: [], conversations: [] });
  const router = useRouter();
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    const body = document.querySelector("body");
    if (isOpen) {
      body.classList.add("-is-sidebar-open");
    } else {
      body.classList.remove("-is-sidebar-open");
    }
  }, [isOpen]);

  // Debounced global search
  useEffect(() => {
    let t;
    const run = async () => {
      const query = q.trim();
      if (query.length < 2) {
        setResults({ users: [], bookings: [], payments: [], conversations: [] });
        setSearching(false);
        return;
      }
      setSearching(true);
      try {
        const [usersRes, bookingsRes, paymentsRes, convRes] = await Promise.all([
          getAdminUsers({ q: query, limit: 5, includeDisabled: true }),
          getAdminBookings({ q: query, limit: 5 }),
          getTransactions({ q: query, limit: 5 }),
          getConversations({ q: query, limit: 5 }),
        ]);
        const users = (usersRes?.data || usersRes || []).slice?.(0, 5) || [];
        const bookings = (bookingsRes?.bookings || bookingsRes?.data?.bookings || bookingsRes?.data || bookingsRes || []).slice?.(0, 5) || [];
        const payments = (paymentsRes?.transactions || paymentsRes?.data?.transactions || paymentsRes?.data || paymentsRes || []).slice?.(0, 5) || [];
        const conversations = (convRes?.conversations || convRes?.data?.conversations || convRes?.data || convRes || []).slice?.(0, 5) || [];
        setResults({ users, bookings, payments, conversations });
      } catch (_) {
        setResults({ users: [], bookings: [], payments: [], conversations: [] });
      } finally {
        setSearching(false);
      }
    };
    t = setTimeout(run, 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target)) setSearchOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const navigateTo = (type, item) => {
    setSearchOpen(false);
    setQ("");
    if (type === 'user') {
      router.push('/admin/user');
      return;
    }
    if (type === 'booking') {
      router.push('/admin/oversight');
      return;
    }
    if (type === 'payment') {
      router.push('/admin/finance');
      return;
    }
    if (type === 'conversation') {
      router.push('/admin/customer-support');
      return;
    }
  };

  return (
    <>
      <header
        className={`header -dashboard ${navbar ? "is-sticky bg-white" : ""}`}
      >
        <div className="header__container px-30 sm:px-20">
          <div className="-left-side">
            <a href="/" className="header-logo">
              <img src="/img/general/plistLogo-blue.svg" alt="logo icon" />
            </a>
            {/* End logo */}
          </div>
          {/* End _left-side */}

          <div className="row justify-between items-center pl-60 lg:pl-20">
            <div className="col-auto">
              <div className="d-flex items-center">
                <button className="d-flex" onClick={handleToggle}>
                  <i className="icon-menu-2 text-20"></i>
                </button>

                <div className="single-field relative d-flex items-center md:d-none ml-30" ref={searchRef}>
                  <input
                    className="pl-50 border-light text-dark-1 h-50 rounded-16"
                    type="text"
                    placeholder="Search across platform..."
                    value={q}
                    onChange={(e) => { setQ(e.target.value); setSearchOpen(true); }}
                    onFocus={() => setSearchOpen(true)}
                  />
                  <button className="absolute d-flex items-center h-full" onClick={() => setSearchOpen((o) => !o)}>
                    <i className="icon-search text-20 px-15 text-dark-1"></i>
                  </button>
                  {searchOpen && (
                    <div className="position-absolute bg-white border-light rounded-16 shadow-3 mt-5" style={{ top: '100%', left: 0, right: 0, zIndex: 1000 }}>
                      <div className="px-15 py-10 text-12 text-light-1">{searching ? 'Searching…' : (q.trim().length < 2 ? 'Type at least 2 characters' : 'Results')}</div>
                      {q.trim().length >= 2 && !searching && (
                        <div className="py-5">
                          <div className="px-15 text-12 text-light-1">Users</div>
                          {results.users.length === 0 ? (<div className="px-15 py-6 text-12 text-light-1">No users</div>) : results.users.map((u) => (
                            <div key={u.id} className="px-15 py-8 cursor-pointer hover:bg-light-2 text-14" onClick={() => navigateTo('user', u)}>
                              {u.email || u.name || `User #${u.id}`}
                            </div>
                          ))}
                          <div className="px-15 mt-10 text-12 text-light-1">Bookings</div>
                          {results.bookings.length === 0 ? (<div className="px-15 py-6 text-12 text-light-1">No bookings</div>) : results.bookings.map((b) => (
                            <div key={b.id || b.ticket_id} className="px-15 py-8 cursor-pointer hover:bg-light-2 text-14" onClick={() => navigateTo('booking', b)}>
                              {b.issue || b.name || b.id || b.ticket_id}
                            </div>
                          ))}
                          <div className="px-15 mt-10 text-12 text-light-1">Payments</div>
                          {results.payments.length === 0 ? (<div className="px-15 py-6 text-12 text-light-1">No payments</div>) : results.payments.map((p) => (
                            <div key={p.id} className="px-15 py-8 cursor-pointer hover:bg-light-2 text-14" onClick={() => navigateTo('payment', p)}>
                              {p.invoice_number || p.reference_id || `Txn #${p.id}`}
                            </div>
                          ))}
                          <div className="px-15 mt-10 text-12 text-light-1">Conversations</div>
                          {results.conversations.length === 0 ? (<div className="px-15 py-6 text-12 text-light-1">No conversations</div>) : results.conversations.map((c) => (
                            <div key={c.id} className="px-15 py-8 cursor-pointer hover:bg-light-2 text-14" onClick={() => navigateTo('conversation', c)}>
                              {c.subject || c.name || `Conversation #${c.id}`}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* End .col-auto */}

            <div className="col-auto">
              <div className="d-flex items-center">
                {/* <div className="header-menu">
                  <div className="header-menu__content">
                    <MainMenu style="text-dark-1" />
                  </div>
                </div> */}
                {/* End header-menu */}

                <div className="row items-center x-gap-5 y-gap-20 pl-20 lg:d-none">
                  <div className="col-auto">
                    <button className="button -blue-1-05 size-50 rounded-22 flex-center" onClick={() => router.push('/admin/customer-support')}>
                      <i className="icon-email-2 text-20"></i>
                    </button>
                  </div>
                  {/* End col-auto */}

                  <div className="col-auto">
                    <button className="button -blue-1-05 size-50 rounded-22 flex-center" onClick={() => router.push('/admin/notification')}>
                      <i className="icon-notification text-20"></i>
                    </button>
                  </div>
                  {/* End col-auto */}
                </div>
                {/* End .row */}

                <div className="pl-15 position-relative" ref={profileRef}>
                  <button className="border-0 bg-transparent p-0" onClick={() => setProfileOpen((o) => !o)}>
                    <Image
                      width={50}
                      height={50}
                      src="/img/misc/avatar-1.png"
                      alt="image"
                      className="size-50 rounded-full object-cover"
                      unoptimized
                    />
                  </button>
                  {profileOpen && (
                    <div className="position-absolute bg-white border-light rounded-16 shadow-3 mt-10" style={{ minWidth: 150, zIndex: 1000, right: 0 }}>
                      <div className="px-15 py-12 border-bottom-light">
                        <div className="text-14 fw-600">{user?.name || user?.email || 'Admin'}</div>
                        <div className="text-12 text-light-1">{(user?.role || 'admin').toString().replace(/\b\w/g, c => c.toUpperCase())}</div>
                      </div>
                      <div className="py-5">
                        <div className="px-15 py-10 cursor-pointer hover:bg-light-2 text-14" onClick={() => { setProfileOpen(false); router.push('/admin/setting'); }}>Profile</div>
                        <div className="px-15 py-10 cursor-pointer hover:bg-light-2 text-14 text-red-1" onClick={() => { setProfileOpen(false); logout(); router.push('/login'); }}>Logout</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-none xl:d-flex x-gap-20 items-center pl-20">
                  <div>
                    <button
                      className="d-flex items-center icon-menu text-20"
                      data-bs-toggle="offcanvas"
                      aria-controls="mobile-sidebar_menu"
                      data-bs-target="#mobile-sidebar_menu"
                    ></button>
                  </div>

                  <div
                    className="offcanvas offcanvas-start  mobile_menu-contnet "
                    tabIndex="-1"
                    id="mobile-sidebar_menu"
                    aria-labelledby="offcanvasMenuLabel"
                    data-bs-scroll="true"
                  >
                    <MobileMenu />
                  </div>
                </div>
              </div>
              {/* End -flex items-center */}
            </div>
            {/* End col-auto */}
          </div>
          {/* End .row */}
        </div>
        {/* End header_container */}
      </header>
      {/* End header */}
    </>
  );
};

export default HeaderDashBoard;
