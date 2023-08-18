import React, { useState, useEffect } from 'react';
import { Box, Text, Button, useToast } from '@chakra-ui/react';
import GitClient from '@/utils/gitClient';
import ReactMarkdown from 'react-markdown'
import { LightMarkdownComponents } from '@/styles/LightMarkdownComponent';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'

interface RepoListProps {
  onSelect: (repo: string) => void;
}

const RepoList: React.FC<RepoListProps> = ({ onSelect }) => {
  const [repos, setRepos] = useState<{name: string, description: string}[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const gitClient = GitClient.getInstance();
        const response = await gitClient.repos();
        if (response.success) {
          setRepos(response.data);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch repos',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchRepos();
  }, []);

  const handleSelectRepo = (repo: string) => {
    onSelect(repo);
  };

  const handleDeleteRepo = async (repo: string) => {
    try {
      const gitClient = GitClient.getInstance();
      await gitClient.deleteRepo(repo);
      toast({
        title: 'Success',
        description: 'Repo deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setRepos(prevRepos => prevRepos.filter(r => r.name !== repo));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete repo',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {repos.map(repo => (
        <Box key={repo.name} p={5} shadow="md" borderWidth="1px" borderRadius="lg" p={4}>
          <Box>
            <Text fontSize="xl" fontWeight="bold">{repo.name}</Text>               
          </Box>
          <Box p={2}>
            <Text fontWeight="bold">README.md</Text>
            <Box height={"200px"} overflow={"scroll"} m={2} p={8} bg={"#000"}>            
              <ReactMarkdown components={LightMarkdownComponents}>{repo.description}</ReactMarkdown>
            </Box>
          </Box>
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button colorScheme="red" variant="outline" onClick={() => handleDeleteRepo(repo.name)}>
              Delete
            </Button>
            <Button colorScheme="teal" variant="outline" onClick={() => handleSelectRepo(repo.name)}>
              Select
            </Button>
          </Box>
        </Box>
      ))}
    </>
  );
};

export default RepoList;
