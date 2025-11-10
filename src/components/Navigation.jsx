// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';

export function Navigation({
  $w,
  currentPage
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLang, setCurrentLang] = useState('zh');
  const navigationItems = [{
    id: 'home',
    label: '首页',
    pageId: 'home'
  }, {
    id: 'demo',
    label: 'AI演示',
    pageId: 'demo'
  }, {
    id: 'chat',
    label: '智能对话',
    pageId: 'chat'
  }, {
    id: 'profile',
    label: '个人中心',
    pageId: 'profile'
  }];
  const handleNavigation = pageId => {
    $w.utils.navigateTo({
      pageId,
      params: {}
    });
    setIsMenuOpen(false);
  };
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  const toggleLanguage = () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    setCurrentLang(newLang);
  };
  return <nav className="bg-gradient-to-r from-gray-900 to-black text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-white to-black rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-black to-white rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <span className="ml-3 text-xl font-bold">SIMIAI太极AI</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigationItems.map(item => <button key={item.id} onClick={() => handleNavigation(item.pageId)} className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currentPage === item.id ? 'bg-white bg-opacity-20 text-white' : 'text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white'}`}>
                      {item.label}
                    </button>)}
                </div>
              </div>

              {/* Right side buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <button onClick={toggleLanguage} className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors" title="切换语言">
                  <Globe className="w-5 h-5" />
                </button>
                <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors" title="切换主题">
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <Button onClick={() => handleNavigation('profile')} className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800">
                  登录/注册
                </Button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-white hover:bg-opacity-10">
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && <div className="md:hidden bg-black bg-opacity-95">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigationItems.map(item => <button key={item.id} onClick={() => handleNavigation(item.pageId)} className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-200 ${currentPage === item.id ? 'bg-white bg-opacity-20 text-white' : 'text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white'}`}>
                    {item.label}
                  </button>)}
                <div className="flex items-center space-x-4 px-3 py-2">
                  <button onClick={toggleLanguage} className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10">
                    <Globe className="w-5 h-5" />
                  </button>
                  <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10">
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>}
        </nav>;
}