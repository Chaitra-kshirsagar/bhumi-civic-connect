
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Download } from 'lucide-react';

// Mock Firebase auth and firestore - replace with actual Firebase imports
const useAuth = () => {
  // Mock auth hook - replace with actual Firebase auth
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      setUser(null); // Set to null to show redirect behavior
      setLoading(false);
    }, 1000);
  }, []);
  
  return { user, loading };
};

interface RSVP {
  id: string;
  eventTitle: string;
  eventDate: string;
  location: string;
  rsvpDate: string;
}

const VolunteerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchUserRSVPs();
    }
  }, [user, authLoading, navigate]);

  const fetchUserRSVPs = async () => {
    try {
      // Mock data - replace with actual Firestore query
      // const rsvpsRef = collection(db, 'events');
      // const q = query(rsvpsRef, where('rsvps', 'array-contains', user.uid));
      // const snapshot = await getDocs(q);
      
      // Mock RSVP data
      const mockRSVPs: RSVP[] = [
        {
          id: '1',
          eventTitle: 'Beach Cleanup Drive',
          eventDate: '2024-07-15',
          location: 'Marina Beach, Chennai',
          rsvpDate: '2024-06-20'
        },
        {
          id: '2',
          eventTitle: 'Tree Plantation',
          eventDate: '2024-07-22',
          location: 'Central Park, Mumbai',
          rsvpDate: '2024-06-25'
        }
      ];
      
      // Sort by event date (upcoming first)
      const sortedRSVPs = mockRSVPs.sort((a, b) => 
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
      );
      
      setRsvps(sortedRSVPs);
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-[#43A047] text-lg">Loading...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#43A047] mb-8">My Events</h1>
        
        {rsvps.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <Calendar className="h-12 w-12 text-[#F9A825] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Events Yet
              </h3>
              <p className="text-gray-500 mb-4">
                You haven't RSVP'd to any events yet. Start volunteering to make a difference!
              </p>
              <Button 
                onClick={() => navigate('/events')}
                className="bg-[#43A047] hover:bg-[#43A047]/90"
              >
                Browse Events
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rsvps.map((rsvp) => (
              <Card key={rsvp.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#43A047] text-lg">
                    {rsvp.eventTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-[#F9A825]" />
                    <span className="text-sm">
                      Event Date: {formatDate(rsvp.eventDate)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-[#F9A825]" />
                    <span className="text-sm">{rsvp.location}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    RSVP'd on: {formatDate(rsvp.rsvpDate)}
                  </div>
                  
                  <Button 
                    disabled 
                    className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
