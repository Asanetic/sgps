'use client';

import * as FaIcons from 'react-icons/fa';
import { mosyTonum } from '../../../MosyUtils/hiveUtils';

const defaultCardData = [
  {
    title: 'Members',
    value: '1,200',
    percentage: '+15%',
    icon: "FaUsers",
  },
  {
    title: 'Deposits',
    value: 'KES 235,000',
    percentage: '+8%',
    icon: "FaDatabase",
  },
  {
    title: 'Interests',
    value: 'KES 52,000',
    percentage: '+4%',
    icon: "FaCheckCircle",
  },
  {
    title: 'Payouts',
    value: 'KES 97,000',
    percentage: '-2%',
    icon: "FaCreditCard",
  },
];

export default function DashboardCards({ cards = defaultCardData }) {
  return (
    <div className="col-md-12 row justify-content-center py-4 m-0">
      {/* Title Ribbon */}
      <div className="col-md-12 text-center p-0 m-0">
        <h4 className="text-left col-md-12 p-0 m-0 ">Dashboard</h4>
        <div className="bg-dark mt-3" style={{ height: '1px' }}></div>
        <h3 className="m-2"></h3>
      </div>

      {/* Cards */}
      <div className="row justify-content-center m-0 p-0 mt-3 col-md-12">
        {cards.map((card, index) => {
          const Icon = FaIcons[card.icon];
          return (
            <div className={`col-lg-3 col-sm-6 mb-3`} key={index}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div className="card-success">
                      <p className="card-text go-to-date py-3" style={{ cursor: 'pointer' }}>
                        {card.title}
                      </p>
                      <div className="d-flex align-items-end mb-2">
                        <h4 className="card-title mb-0 me-2">{(card.value)}</h4>
                      </div>
                      <small>{card.percentage}</small>
                    </div>
                    <div className="card-icon">
                      <span className="badge bg-label-success rounded p-2">
                        {Icon ? <Icon className="text-success medium_icon" /> : null}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="col-md-12 pt-2 p-0"></div>
    </div>
  );
}
