// useEffect(() => {
//   let isFetching = false;

//   function handleScroll() {
//     if (isFetching) return;

//     const bottom =
//       window.innerHeight + window.scrollY >=
//       document.documentElement.scrollHeight - 300;

//     if (bottom && visibleCount < produits.length) {
//       isFetching = true;
//       setLoadingMore(true);

//       setTimeout(() => {
//         setVisibleCount(prev => Math.min(prev + 4, produits.length));
//         setLoadingMore(false);
//         isFetching = false;
//       }, 600);
//     }
//   }

//   window.addEventListener("scroll", handleScroll);
//   return () => window.removeEventListener("scroll", handleScroll);
// }, [visibleCount]);
