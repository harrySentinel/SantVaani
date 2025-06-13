
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LivingSaint {
  id: number;
  name: string;
  nameHi: string;
  organization: string;
  specialty: string;
  specialtyHi: string;
  image: string;
  description: string;
  descriptionHi: string;
  website: string;
  followers: string;
  teachings: string[];
  birthPlace?: string;
  birthPlaceHi?: string;
  currentLocation?: string;
  currentLocationHi?: string;
  biography: string;
  biographyHi: string;
}

interface LivingSaintModalProps {
  saint: LivingSaint | null;
  isOpen: boolean;
  onClose: () => void;
}

const LivingSaintModal: React.FC<LivingSaintModalProps> = ({ saint, isOpen, onClose }) => {
  if (!saint) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-white to-orange-50 shadow-2xl border border-orange-200/50"
          >
            {/* Close Button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 transition-all duration-300"
            >
              <X className="w-5 h-5 text-gray-700" />
            </Button>

            {/* Content Container */}
            <div className="h-full overflow-y-auto">
              <div className="min-h-full p-6 md:p-8 lg:p-12">
                <div className="max-w-4xl mx-auto">
                  {/* Header Section */}
                  <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    {/* Saint Image */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto lg:mx-0 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-orange-200/50">
                        <img
                          src={saint.image}
                          alt={saint.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 text-center">
                            <p className="text-xs text-orange-600 font-medium">Currently Active</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Saint Info */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex-1 text-center lg:text-left space-y-4"
                    >
                      <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 bg-clip-text text-transparent leading-tight">
                          {saint.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-orange-600 font-medium">
                          {saint.nameHi}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        {saint.birthPlace && (
                          <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-600 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                            <Calendar className="w-5 h-5 text-orange-500" />
                            <span className="font-medium">{saint.birthPlace}</span>
                          </div>
                        )}
                        {saint.currentLocation && (
                          <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-600 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                            <MapPin className="w-5 h-5 text-orange-500" />
                            <span className="font-medium">{saint.currentLocation}</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl p-4 border border-orange-200/50">
                        <p className="text-sm text-orange-600 font-medium mb-1">Specialty</p>
                        <p className="text-lg font-semibold text-gray-800">{saint.specialty}</p>
                        <p className="text-sm text-orange-600 mt-1">{saint.specialtyHi}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Biography Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        Life & Teachings
                      </h2>
                      <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full" />
                    </div>

                    {/* English Biography */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-orange-100">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mr-3" />
                        Biography
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                        {saint.biography}
                      </p>
                    </div>

                    {/* Hindi Biography */}
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl p-6 md:p-8 shadow-lg border border-orange-200/50">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mr-3" />
                        जीवनी
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                        {saint.biographyHi}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LivingSaintModal;
