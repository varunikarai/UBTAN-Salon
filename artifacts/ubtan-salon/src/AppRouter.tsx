import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Switch, useLocation } from 'wouter';
import App from './App';
import { OurStory } from './pages/OurStory';
import { PriceList } from './pages/PriceList';
import { ContactFab } from './components/ContactFab';
import { GlobalBackground } from './components/GlobalBackground';

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

export default function AppRouter() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <GlobalBackground />
      <AnimatePresence mode="wait">
        <motion.div
          key={location}
          initial={PAGE_TRANSITION.initial}
          animate={PAGE_TRANSITION.animate}
          exit={PAGE_TRANSITION.exit}
          transition={PAGE_TRANSITION.transition}
        >
          <Switch location={location}>
            <Route path="/our-story" component={OurStory} />
            <Route path="/price-list" component={PriceList} />
            <Route path="/" component={App} />
          </Switch>
        </motion.div>
      </AnimatePresence>
      <ContactFab />
    </>
  );
}
