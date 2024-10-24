import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Badge,
  Box,
} from '@chakra-ui/react';

const RelationMapper = ({ relationExtraction }) => {
  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <TableCaption placement="top"><h1>Relation Extraction Data</h1></TableCaption>
        <Thead>
          <Tr>
            <Th>Entity Name</Th>
            <Th>Relation</Th>
            <Th>Entities</Th>
          </Tr>
        </Thead>
        <Tbody>
          {relationExtraction?.map((entity, index) => (
            entity.relations?.map((relation, idx) => (
              <Tr key={`${index}-${idx}`}>
                {idx === 0 && (
                  <Td rowSpan={entity.relations.length}>{entity.name}</Td>
                )}
                <Td>{relation.relation}</Td>
                <Td>
                  {relation.entities?.map((entity, idx) => (
                    <Badge
                      key={idx}
                      colorScheme={relation.status === 'Blue' ? 'blue' : undefined}
                      mr={1}
                    >
                      {entity}
                    </Badge>
                  ))}
                </Td>
              </Tr>
            ))
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default RelationMapper;
