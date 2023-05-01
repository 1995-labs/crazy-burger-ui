import { ScaleFade, SimpleGrid } from "@chakra-ui/react";
import firebase from "firebase/compat/app";
import { useCallback, useEffect } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { useStoreMenuContext } from "../contexts/StoreMenuContext";
import { useStoreTagsContext } from "../contexts/StoreTagsContext";
import { useWindowSize } from "../hooks/useWindowSize";
import { PageLoader } from "../shared/PageLoader";
import { ProductCard } from "./ProductCard";

export const gridCalculator = (
  width: number
): [number, number, number, number] => {
  if (width <= 320) {
    return [1, 1, 1, 0];
  } else if (width <= 375) {
    return [1, 2, 1, 0];
  } else if (width <= 425) {
    return [2, 2, 2, 0];
  } else if (width <= 600) {
    return [2, 2, 3, 0];
  } else if (width <= 768) {
    return [3, 2, 3, 0];
  } else if (width <= 1024) {
    return [4, 2, 3, 0];
  } else {
    return [5, 2, 4, 0];
  }
};

export const ProductGrid = () => {
  const { filters } = useSearchContext();
  const { width } = useWindowSize();
  const { tags, isTagsLoading } = useStoreTagsContext();
  const { menu, isMenuLoading } = useStoreMenuContext();

  useEffect(() => {
    firebase.analytics().logEvent("view_item_list");
  }, []);

  const getColumns = useCallback(() => gridCalculator(width), [width]);

  const getProducts = useCallback(
    () => menu.filter((item) => tags.some((tag) => item.tags.includes(tag.id))),
    [menu, tags]
  );

  if (isMenuLoading || isTagsLoading) {
    return <PageLoader />;
  }

  return (
    <SimpleGrid
      p={getColumns()[3]}
      mx={getColumns()[1]}
      columns={getColumns()[0]}
      spacing={getColumns()[2]}
      mb={"70px"}
    >
      {getProducts().map((menuItem) => (
        <ScaleFade
          initialScale={0.5}
          key={menuItem.id}
          unmountOnExit
          in={
            filters.length === 0 ||
            menuItem.tags.some((tagRef) => filters.includes(tagRef))
          }
        >
          <ProductCard menuItem={menuItem} />
        </ScaleFade>
      ))}
    </SimpleGrid>
  );
};

export default ProductGrid;
