import { Flex, Tab, TabList, Tabs } from "@chakra-ui/react";
import { ClientCatalogTagConfigType } from "../types/Client";

type Props = {
  menuTags: ClientCatalogTagConfigType[];
  handleTabsChange: (e: number) => void;
};

export const StoreTabs = ({ menuTags, handleTabsChange }: Props) => {
  return (
    <Flex
      position="sticky"
      top="0"
      bgColor="primary.100"
      zIndex="sticky"
      height="60px"
      alignItems="center"
      flexWrap="nowrap"
      overflowX="auto"
      px="2"
      css={{
        WebkitOverflowScrolling: "touch",
        msOverflowStyle: "-ms-autohiding-scrollbar",
      }}
    >
      <Tabs width="100%" onChange={handleTabsChange}>
        <TabList>
          {menuTags.map((tag) => (
            <Tab key={tag.id}>{tag.label}</Tab>
          ))}
        </TabList>
      </Tabs>
    </Flex>
  );
};
