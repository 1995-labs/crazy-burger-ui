import { Box, Heading, SimpleGrid } from "@chakra-ui/layout";
import React from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import { ClientCatalogItemType, ClientType } from "../types/Client";
import { ProductCard } from "./ProductCard";
import { gridCalculator } from "./ProductGrid";

type Props = {
  store: ClientType;
  menu: ClientCatalogItemType[];
  heading: string;
};

export const GridItem = ({ store, heading, menu }: Props) => {
  const [columns, setColumns] = React.useState<
    [number, number, number, number]
  >([1, 0, 5, 0]);
  const { width } = useWindowSize();

  React.useEffect(() => {
    setColumns(gridCalculator(width));
  }, [width]);

  if (menu.length === 0) {
    return <></>;
  }

  return (
    <Box
      maxWidth="100%"
      mb={2}
      borderRadius="lg"
      boxShadow="md"
      backgroundColor="orange.300"
    >
      <Heading textAlign="center" p={columns[3]} as="h4" size="lg">
        {heading}
      </Heading>
      <SimpleGrid
        p={columns[3]}
        mx={columns[1]}
        columns={columns[0]}
        spacing={columns[2]}
      >
        {menu.map((menuItem) => (
          <ProductCard
            // logo={store.logo}
            key={menuItem.id}
            menuItem={menuItem}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default GridItem;
