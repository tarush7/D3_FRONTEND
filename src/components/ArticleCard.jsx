import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardBody, CardFooter, Image, Stack, Heading, Text, Button, Badge, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Divider, Checkbox, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton, Switch, VStack, HStack
} from '@chakra-ui/react';
import { FaFile, FaEye, FaNetworkWired, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import RelationMapper from './RelationTable';
import { fetchArticles } from '../features/articles/articleThunk';
import { toggleArticle } from '../features/articles/selectedArticlesSlice';
import { mergeRelations, clearMergedRelations } from '../features/articles/mergedRelationsSlice';
import { postMergedRelations, clearApiResponse } from '../features/relations/apiRelationsSlice';
import GenerateGraphButton from './GenerateGraphButton';

const MotionCard = motion(Card);

const ArticleCard = () => {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.articles);
  const selectedArticles = useSelector((state) => state.selectedArticles.selectedArticles);
  const mergedRelations = useSelector((state) => state.mergedRelations.mergedRelations);
  const apiStatus = useSelector((state) => state.apiRelations.apiStatus);
  const apiResponse = useSelector((state) => state.apiRelations.apiResponse);
  const [showAllNer, setShowAllNer] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [modalType, setModalType] = useState(null);

  const {
    isOpen: isOpenInfo,
    onOpen: onOpenInfo,
    onClose: onCloseInfo,
  } = useDisclosure();
  const {
    isOpen: isOpenShare,
    onOpen: onOpenShare,
    onClose: onCloseShare,
  } = useDisclosure();
  const {
    isOpen: isOpenBookmark,
    onOpen: onOpenBookmark,
    onClose: onCloseBookmark,
  } = useDisclosure();
  const {
    isOpen: isOpenPopover,
    onOpen: onOpenPopover,
    onClose: onClosePopover,
  } = useDisclosure();

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const handleReadMoreClick = (articleId) => {
    setShowAllNer((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

  const openModal = (type, article) => {
    setSelectedArticle(article);
    setModalType(type);
    switch (type) {
      case 'info':
        onOpenInfo();
        break;
      case 'share':
        onOpenShare();
        break;
      case 'bookmark':
        onOpenBookmark();
        break;
      default:
        break;
    }
  };

  const handleCheckboxChange = (article) => {
    dispatch(toggleArticle(article));
  };

  const handleClearMergedRelations = () => {
    dispatch(clearMergedRelations());
  };

  const handleLogMergedRelations = () => {
    console.log('Merged Relations:', JSON.stringify(mergedRelations, null, 2));
  };

  const handleMergeRelations = () => {
    dispatch(mergeRelations(selectedArticles));
  };

  const handleApiMergeRelations = () => {
    dispatch(postMergedRelations(mergedRelations));
  };

  useEffect(() => {
    if (apiStatus === 'succeeded') {
      console.log('API Response:', apiResponse);
    }
  }, [apiStatus, apiResponse]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Array.isArray(articles) && articles.length > 0 ? (
        articles.map((article) => (
          <MotionCard
            key={article.articleId}
            direction={{ base: 'column', sm: 'row' }}
            overflow="hidden"
            variant="outline"
            height="300px"
            bg="white"
            shadow="lg"
            whileHover={{ scale: 1.03, boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)' }}
            transition={{ duration: 0.2 }}
          >
            <Stack className='w-full ml-1'>
              <CardBody display="flex" p={2}>
                <Box flexShrink={0}>
                  <Image
                    src={article.articleMedia && article.articleMedia.length > 0 ? article.articleMedia[0].mediaUrl : "https://via.placeholder.com/150"}
                    alt="Sample Image"
                    boxSize="180px"
                    borderRadius="md"
                    boxShadow="0px 8px 16px rgba(0, 0, 0, 0.2)"
                  />
                </Box>
                <Box
                  ml={4}
                  maxHeight="200px"
                  overflowY="auto"
                  flex="1"
                  display="flex"
                  flexDirection="column"
                >
                  <Heading size="md">{article.articleAuthor || article.articleNewsSource}</Heading>
                  <Text py="2">{article.articlePublishDate}</Text>

                  <Heading size="sm" mt={4} mb={2}>
                    Identified Entities
                  </Heading>

                  {article.unique_ner && Object.keys(article.unique_ner).length > 0 ? (
                    <>
                      <Stack spacing={2}>
                        {article.unique_ner.PERSON?.length > 0 ? (
                          article.unique_ner.PERSON
                            .slice(0, showAllNer[article.articleId] ? article.unique_ner.PERSON.length : 1)
                            .map((person, index) => (
                              <Badge key={index} colorScheme="teal">
                                {person}
                              </Badge>
                            ))
                        ) : (
                          <Text>No entities available</Text>
                        )}
                      </Stack>

                      {showAllNer[article.articleId] && (
                        <Stack spacing={2} mt={4}>
                          <Heading size="sm" mt={4} mb={2}>
                            All Identified Entities
                          </Heading>
                          {Object.keys(article.unique_ner || {})
                            .filter((category) => category !== 'ALL' && category !== 'PERSON')
                            .map((category) => (
                              <Stack key={category} spacing={2}>
                                <Heading size="sm">{category}</Heading>
                                {article.unique_ner[category].length > 0 ? (
                                  article.unique_ner[category].map((value, index) => (
                                    <Badge key={index} colorScheme="purple">
                                      {value}
                                    </Badge>
                                  ))
                                ) : (
                                  <Text>No {category} entities available</Text>
                                )}
                              </Stack>
                            ))}
                        </Stack>
                      )}

                      {Object.keys(article.unique_ner).length > 1 && (
                        <Button
                          className="mt-5"
                          variant="outline"
                          size="sm"
                          colorScheme="blue"
                          leftIcon={showAllNer[article.articleId] ? <FaChevronUp /> : <FaChevronDown />}
                          onClick={() => handleReadMoreClick(article.articleId)}
                        >
                          {showAllNer[article.articleId] ? 'Show Less' : 'Show More'}
                        </Button>
                      )}
                    </>
                  ) : (
                    <Text>No NER available</Text>
                  )}
                </Box>
              </CardBody>
              <Divider />
              <CardFooter display="flex" justifyContent="space-between" alignItems="center"  px={3} py={6}>
                <div>
                  <Button
                    aria-label="More Information"
                    onClick={() => openModal('info', article)}
                    leftIcon={<FaNetworkWired />}
                    mr={2}
                    boxShadow="0px 5px 10px rgba(0, 0, 0, 0.1)"
                  />
                  <Button
                    aria-label="Share Article"
                    onClick={() => openModal('share', article)}
                    leftIcon={<FaEye />}
                    mr={2}
                    boxShadow="0px 5px 10px rgba(0, 0, 0, 0.1)"
                  />
                  <Button
                    aria-label="Bookmark Article"
                    onClick={() => openModal('bookmark', article)}
                    leftIcon={<FaFile />}
                    boxShadow="0px 5px 10px rgba(0, 0, 0, 0.1)"
                  />
                </div>
                <Checkbox
                  isChecked={selectedArticles.some(a => a.articleId === article.articleId)}
                  onChange={() => handleCheckboxChange(article)}
                >
                  Add to 360 Profiling
                </Checkbox>
              </CardFooter>
            </Stack>
          </MotionCard>
        ))
      ) : (
        <Text>No articles available</Text>
      )}

      {selectedArticle && modalType === 'info' && (
        <Modal isOpen={isOpenInfo} onClose={onCloseInfo} size="xl"  scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack spacing={4}>
                <Text>Extracted Entity Attributes</Text>
                <Badge>type1</Badge>
                <Badge colorScheme="blue">type2</Badge>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <RelationMapper relationExtraction={selectedArticle.analyticsData?.relationExtraction || []} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {selectedArticle && modalType === 'share' && (
        <Modal isOpen={isOpenShare} onClose={onCloseShare} size="xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedArticle.articleTitle}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedArticle.articleBigContent ? (
                <Text whiteSpace="pre-wrap">{selectedArticle.articleBigContent}</Text>
              ) : (
                <Text>No content available</Text>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {selectedArticle && modalType === 'bookmark' && (
        <Modal isOpen={isOpenBookmark} onClose={onCloseBookmark} size="xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Summary</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedArticle.analyticsData?.summary?.sentences.length > 0 ? (
                <Stack spacing={3}>
                  {selectedArticle.analyticsData.summary.sentences.map((sentence, index) => (
                    <Text key={index}>{sentence}</Text>
                  ))}
                </Stack>
              ) : (
                <Text>No summary available</Text>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {Array.isArray(selectedArticles) && selectedArticles.length > 0 && (
        <Box position="fixed" bottom="4" right="4">
          <Popover isOpen={isOpenPopover} onClose={onClosePopover} placement="top">
            <PopoverTrigger>
              <Button colorScheme="blue" boxShadow="0px 8px 16px rgba(0, 0, 0, 0.2)" onClick={onOpenPopover}>360 deg. Profiles</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Selected Articles</PopoverHeader>
              <PopoverBody>
                <VStack align="stretch" spacing={4}>
                  {selectedArticles.map(article => (
                    <Box key={article.articleId} display="flex" alignItems="center" justifyContent="space-between">
                      <Heading size="sm">{article.articleAuthor || article.articleNewsSource}</Heading>
                      <Switch
                        isChecked={selectedArticles.some(a => a.articleId === article.articleId)}
                        onChange={() => handleCheckboxChange(article)}
                      />
                    </Box>
                  ))}
                  <Button onClick={handleMergeRelations} colorScheme="blue">Merge Relations</Button>
                  <Button onClick={handleLogMergedRelations} colorScheme="green">Log Merged Relations</Button>
                  <Button onClick={handleApiMergeRelations} colorScheme="blue">Send to API</Button>
                  <Button onClick={handleClearMergedRelations} colorScheme="red">Clear Merged Relations</Button>
                  <GenerateGraphButton />
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      )}
    </div>
  );
};

export default ArticleCard;
