import { Link } from 'react-router-dom';
import type { Experience } from '../types';
import { API_ROOT } from '../api';

interface Props {
  experience: Experience;
}

const ExperienceCard = ({ experience }: Props) => {
  const fullImageUrl = `${API_ROOT}${experience.imageUrl}`;

  return (
    // Card
    <div className="w-[280px] rounded-xl shadow-md overflow-hidden flex flex-col bg-white">
      {/* Image */}
      <img
        src={fullImageUrl}
        alt={experience.title}
        className="w-full h-[170px] object-cover"
      />

      {/* Content Area */}
      <div className="flex-grow flex flex-col justify-between bg-[#F0F0F0] px-4 py-3">
        {/* Top Content Block */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-zinc-900">
              {experience.title}
            </h3>
            <span
              className="
                rounded 
                bg-[#D6D6D6] 
                px-2 py-1 
                text-[11px] font-medium text-[#161616]
              "
            >
              {experience.location}
            </span>
          </div>
          <p className="text-xs font-normal text-[#6C6C6C] h-[32px] line-clamp-2">
            {experience.description}
          </p>
        </div>

        {/* Bottom Row (Price/Button) */}
        <div className="flex justify-between items-center">
          {/* Price Block */}
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-normal text-zinc-600">From</span>
            <span className="text-xl font-medium text-zinc-900">
              ₹{experience.price}
            </span>
          </div>

          <Link
            to={`/experience/${experience.id}`}
            className="bg-[#FFD643]  hover:bg-primary-hover text-black font-medium px-4 py-2 rounded-md text-sm transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;