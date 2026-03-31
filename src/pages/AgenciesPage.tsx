import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Globe, 
  Heart, 
  CheckCircle2,
  X,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { mockAgencies, mockAgencyProfiles } from '@/data/mock';
import type { AgencyFilters } from '@/types';

const specializations = [
  'Fashion',
  'Commercial',
  'Runway',
  'Editorial',
  'Plus Size',
  'Fitness',
  'Beauty',
];

export function AgenciesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AgencyFilters>({});
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);

  const filteredAgencies = mockAgencies.filter((agency) => {
    const profile = mockAgencyProfiles[agency.id];
    if (!profile) return false;

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = agency.name.toLowerCase().includes(query);
      const matchesLocation = profile.location.toLowerCase().includes(query);
      if (!matchesName && !matchesLocation) return false;
    }

    // Specialization filter
    if (selectedSpecs.length > 0) {
      const hasSpec = selectedSpecs.some(spec => 
        profile.specialization.some(s => s.toLowerCase() === spec.toLowerCase())
      );
      if (!hasSpec) return false;
    }

    // Location filter
    if (filters.location && !profile.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    return true;
  });

  const toggleSpec = (spec: string) => {
    setSelectedSpecs(prev =>
      prev.includes(spec)
        ? prev.filter(s => s !== spec)
        : [...prev, spec]
    );
  };

  const clearFilters = () => {
    setFilters({});
    setSelectedSpecs([]);
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Browse Agencies
        </h1>
        <p className="text-gray-600">
          Find the perfect agency to represent you
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {(selectedSpecs.length > 0 || filters.location) && (
            <Badge variant="secondary" className="ml-1">
              {selectedSpecs.length + (filters.location ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Specializations */}
              <div>
                <label className="text-sm font-medium mb-2 block">Specializations</label>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => toggleSpec(spec)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedSpecs.includes(spec)
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="Enter city..."
                  value={filters.location || ''}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{filteredAgencies.length}</span> agencies
        </p>
        <Select defaultValue="recommended">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agencies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgencies.map((agency) => {
          const profile = mockAgencyProfiles[agency.id];
          if (!profile) return null;

          return (
            <Card 
              key={agency.id} 
              className="border-0 shadow-sm overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/profile/${agency.id}`)}
            >
              {/* Cover Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={profile.photos[0] || profile.logo}
                  alt={agency.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-14 h-14 border-2 border-white">
                      <AvatarImage src={profile.logo} />
                      <AvatarFallback className="bg-amber-500 text-white">
                        {agency.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-white">{agency.name}</h3>
                      <div className="flex items-center gap-1 text-white/80 text-sm">
                        <MapPin className="w-3 h-3" />
                        {profile.location}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="w-8 h-8 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to favorites
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Info */}
              <CardContent className="p-4">
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {profile.description}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    {profile.representedModelsCount} models
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Globe className="w-4 h-4" />
                    {profile.otherOffices.length + 1} offices
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {profile.specialization.slice(0, 3).map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {profile.specialization.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{profile.specialization.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-1">
                    {agency.isVerified ? (
                      <Badge className="bg-green-500">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </div>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAgencies.length === 0 && (
        <div className="text-center py-16">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No agencies found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
