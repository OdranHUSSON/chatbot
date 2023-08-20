import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  DrawerOverlay, 
  DrawerContent, 
  DrawerHeader, 
  DrawerCloseButton, 
  DrawerBody, 
  Text, 
  Icon, 
  useDisclosure, 
  Box, 
  Flex
} from '@chakra-ui/react';
import GitClient from '@/utils/gitClient';
import RepoList from '@/components/git/RepoList';
import GitSave from '@/components/git/GitSave';
import GitClone from './GitClone';
import { MdSave } from 'react-icons/md';
import { useColorModeValue } from '@chakra-ui/react';

export const GitModal = ({ isOpen, onClose, fileContent }) => {
  const [repos, setRepos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    GitClient.getInstance().repos()
      .then(data => {
        if (data.success) {
          setRepos(data.data);
        } else {
          console.error(data.error);
        }
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const handleRepoSelect = (repo: string) => {
    setSelectedRepo(repo);
  };

  const handleRepoRemove = () => {
    setSelectedRepo(null);
  };

  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  let menuColor = useColorModeValue('gray.400', 'white');

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size={"xl"}>
      <DrawerOverlay />
      <DrawerContent
       ms={{
         sm: '16px',
       }}
       my={{
         sm: '16px',
       }}
       borderRadius="16px"
       mr={'24px'}
       bg={sidebarBackgroundColor}>
        <DrawerCloseButton />
        <DrawerHeader>
          <Flex
            align={"center"}
            verticalAlign={"center"}
            w="100%"
            p={2}>
              <Icon as={MdSave} color={"brand.500"} mr={2} /> 
              <Text fontStyle={"bold"}>Github</Text>
              <Text fontStyle={"light"}> - save</Text>
          </Flex>            
        </DrawerHeader>
        <DrawerBody>
          {loading ? (
            <Text>Loading...</Text>
          ) : selectedRepo ? (
            <GitSave repoName={selectedRepo} fileContent={fileContent} closeModal={onClose} onRemove={handleRepoRemove} />
          ) : (
            <Box>
              <RepoList repos={repos} onSelect={handleRepoSelect} />
              <GitClone />
            </Box>
            
          )}          
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
