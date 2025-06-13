
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DivineForm {
  id: number;
  name: string;
  nameHi: string;
  symbol: string;
  domain: string;
  domainHi: string;
  image: string;
  description: string;
  descriptionHi: string;
  attributes: string[];
  mantra: string;
  significance: string;
}

interface DivineFormModalProps {
  divineForm: DivineForm | null;
  isOpen: boolean;
  onClose: () => void;
}

const DivineFormModal: React.FC<DivineFormModalProps> = ({ divineForm, isOpen, onClose }) => {
  if (!divineForm) return null;

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
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 via-white to-orange-50 shadow-2xl border border-purple-200/50"
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
                    {/* Divine Form Image */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto lg:mx-0 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-purple-200/50">
                        <img
                          src={divineForm.image}
                          alt={divineForm.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 text-center">
                            <p className="text-xs text-purple-600 font-medium">Divine Form</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Divine Form Info */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex-1 text-center lg:text-left space-y-4"
                    >
                      <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-orange-600 bg-clip-text text-transparent leading-tight">
                          {divineForm.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-purple-600 font-medium">
                          {divineForm.nameHi}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-600 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                          <Crown className="w-5 h-5 text-purple-500" />
                          <span className="font-medium">{divineForm.domain}</span>
                        </div>
                        <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-600 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                          <span className="text-lg">{divineForm.symbol}</span>
                          <span className="font-medium">{divineForm.domainHi}</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-100 to-orange-50 rounded-2xl p-4 border border-purple-200/50">
                        <p className="text-sm text-purple-600 font-medium mb-1">Sacred Mantra</p>
                        <p className="text-lg font-semibold text-gray-800">{divineForm.mantra}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Significance Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        Divine Significance
                      </h2>
                      <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-orange-600 mx-auto rounded-full" />
                    </div>

                    {/* English Description */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-purple-100">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-6 h-6 bg-gradient-to-r from-purple-400 to-orange-600 rounded-full mr-3" />
                        Spiritual Essence
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                        {divineForm.description}
                      </p>
                    </div>

                    {/* Hindi Description */}
                    <div className="bg-gradient-to-r from-purple-50 to-orange-100/50 rounded-2xl p-6 md:p-8 shadow-lg border border-purple-200/50">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-6 h-6 bg-gradient-to-r from-purple-400 to-orange-600 rounded-full mr-3" />
                        आध्यात्मिक सार
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                        {divineForm.descriptionHi}
                      </p>
                    </div>

                    {/* Significance */}
                    <div className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-2xl p-6 md:p-8 shadow-lg border border-orange-200/50">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Sparkles className="w-6 h-6 text-orange-500 mr-3" />
                        Divine Significance
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                        {divineForm.significance}
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

export default DivineFormModal;
