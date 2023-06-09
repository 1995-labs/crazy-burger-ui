import { Box, Button, Collapse, Divider, useColorMode } from "@chakra-ui/react";
import React from "react";
import { useBranch } from "../major/internals/BranchContext";
import { useSearchContext } from "../major/internals/SearchContext";
import { useStoreTagsContext } from "../major/internals/StoreTagsContext";

export const ToggleNav = () => {
  const { filters, setFilters } = useSearchContext();
  const { colorMode } = useColorMode();
  const { branch } = useBranch();
  const { tags, isTagsLoading } = useStoreTagsContext();

  React.useEffect(() => {
    if (!isTagsLoading && tags && tags.length > 0 && branch) {
      const addIds = tags
        .filter((local_tag) => local_tag.default.includes(branch.id))
        .map((tag) => tag.id);
      setFilters(addIds);
    }
  }, [tags, isTagsLoading, branch, setFilters]);

  return (
    <Collapse in={!isTagsLoading && tags.length > 0} animateOpacity>
      <Box
        className="ToggleNav"
        overflowX="auto"
        flexWrap="nowrap"
        display="flex"
        // boxShadow={"sm"}
        // borderBottom={"1px solid #e2e8f0"}
        // backgroundColor={colorMode === "light" ? "white" : "#1a202c"}
        // backgroundColor={"red.900"}
        width="100%"
        py={1}
      >
        <Box>
          <Button
            size={"sm"}
            ml={1}
            onClick={() => {
              setFilters([]);
            }}
            textColor={"white"}
            boxShadow={"sm"}
            backgroundColor={filters.length === 0 ? "gray.900" : "gray.400"}
            _hover={{
              backgroundColor: "gray.900",
            }}
            _active={{
              backgroundColor: filters.length === 0 ? "gray.900" : "gray.400",
            }}
            // colorScheme={filters.length === 0 ? "red" : "gray"}
            variant={filters.length === 0 ? "solid" : "outline"}
            // variant="solid"
          >
            Show{filters.length === 0 ? "ing" : ""} All
          </Button>
        </Box>

        {tags.map((tag) => (
          <Box key={tag.id} flex="0 0 auto">
            <Button
              // _hover={{
              //   backgroundColor: "inherit",
              // }}
              boxShadow={"sm"}
              size={"sm"}
              mx={1}
              onClick={() => {
                setFilters([tag.id]);
              }}
              backgroundColor={
                filters.includes(tag.id) ? "gray.900" : "gray.400"
              }
              _hover={{
                backgroundColor: "gray.900",
              }}
              _active={{
                backgroundColor: filters.includes(tag.id)
                  ? "gray.900"
                  : "gray.400",
              }}
              textColor={"white"}
              // colorScheme={filters.includes(tag.id) ? "red" : "gray"}
              variant={filters.includes(tag.id) ? "solid" : "outline"}
            >
              {filters.includes(tag.id) ? "Showing" : ""} {tag.label}
            </Button>
          </Box>
        ))}
      </Box>
      <Divider />
    </Collapse>
  );
};

// export default ToggleNav
