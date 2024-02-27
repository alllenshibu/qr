import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Button, FormControl, FormLabel, Select, Flex } from '@chakra-ui/react';

import DashboardLayout from '@/layouts/DashboardLayout';
import Scanner from '@/components/Scanner';

import { useAlert } from '@/hooks/useAlert';
import { useFetch } from '@/hooks/useFetch';

export default function CheckInParticipantWithScanner() {
  const { loading, post, get } = useFetch();
  const showAlert = useAlert();

  const router = useRouter();
  const { orgId, eventId } = router.query;

  const [previousPartiicpantId, setPreviousParticipantId] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  const [participants, setParticipants] = useState([]);

  const handleSubmit = async () => {
    const { data, status } = await post(
      `/core/organizations/${orgId}/events/${eventId}/participants/check-in/${participantId}`,
      {},
      {
        checkedInAt: new Date().toISOString(),
      },
    );
    if (status === 200) {
      showAlert({
        title: 'Success',
        description: data.message,
        status: 'success',
      });
      setPreviousParticipantId(participantId);
      setParticipantId(null);
    } else {
      showAlert({
        title: 'Error',
        description: data.error,
        status: 'error',
      });
      setParticipantId(null);
      setPreviousParticipantId(null);
    }
  };

  useEffect(() => {
    if (participantId && previousPartiicpantId !== participantId) handleSubmit();
  }, [participantId]);

  //
  // Periodically clear the previous participant id
  //
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPreviousParticipantId(null);
      setParticipantId(null);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [previousPartiicpantId]);

  useEffect(() => {
    const fetchParticipants = async () => {
      const { data, status } = await get(
        `/core/organizations/${orgId}/events/${eventId}/participants`,
      );
      if (status === 200) {
        setParticipants(data.participants);
      } else {
        showAlert({
          title: 'Error',
          description: data.error,
          status: 'error',
        });
      }
    };
    fetchParticipants();
  }, [orgId, eventId]);

  return (
    <DashboardLayout
      pageTitle="Check In  Participant"
      previousPage={`/organizations/${orgId}/events/${eventId}/participants`}
      headerButton={
        <>
          <Flex flexDirection="column" gap={4}>
            <Button
              onClick={() => {
                router.push(
                  `/organizations/${orgId}/events/${eventId}/participants/check-in/new-in/scanner-slow`,
                );
              }}
              isLoading={loading}
            >
              Quick Scan
            </Button>
          </Flex>
        </>
      }
      debugInfo={JSON.stringify(participantId) + JSON.stringify(previousPartiicpantId)}
    >
      <Flex height="50%" width="50%" justifyContent={'center'} alignItems={'center'}>
        <Scanner result={participantId} setResult={setParticipantId} />
      </Flex>
    </DashboardLayout>
  );
}
