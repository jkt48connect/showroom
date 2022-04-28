import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { FaUser } from 'react-icons/fa';
import { IoVideocamOff } from 'react-icons/io5';
import Fade from 'react-reveal';

import { API } from 'utils/api/api';
import getTimes from 'utils/getTimes';
import Button from 'elements/Button';
import SkeletonLive from './skeleton/SkeletonLive';

export default function RoomLive({ theme, search, isOnLive }) {
  const [loading, setLoading] = useState(false);
  const [onLive, setOnLive] = useState([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function getRoomLive() {
      const room = await axios.get(`${API}/rooms/onlives`);
      const onLive = room.data;
      onLive && onLive.length && setOnLive(onLive);

      if (onLive.length !== undefined) {
        setIsLive(true);
      } else {
        setIsLive(false);
      }
    }
    getRoomLive();
  }, [onLive]);

  const filteredLive = !search
    ? onLive
    : onLive.filter((room) =>
        room.main_name.toLowerCase().includes(search.toLowerCase())
      );

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);

  return (
    isLive ? (
      <div className="mb-4">
        <h3 className="mb-3"> {loading && 'Loading'} Room Live </h3>
        {loading && !isMobile ? (
          <SkeletonLive theme={theme} liveLength={filteredLive.length} />
        ) : filteredLive.length !== 0 ? (
          <div className="container-grid">
            {filteredLive.map((item, idx) => (
              <div
                key={idx}
                className={`item ${
                  isMobile ? 'column-12 row-1' : `column-3 row-1`
                }`}
              >
                <Link to={`room/${item.url_key ?? item.room_url_key}/${item.id ?? item.room_id}`}>
                  <div className="card card-featured">
                    <Fade right>
                      <div className="tag">
                        <FaUser style={{ width: '10' }} className="mb-1" />{' '}
                        {item.view_num}
                      </div>
                      <figure className="img-wrapper">
                        <img
                          src={item.image_square ?? item.image}
                          alt={item.room_name}
                          className="img-cover"
                        />
                      </figure>
                      <div className="meta-wrapper">
                        <Button
                          type="link"
                          style={{ textDecoration: 'none' }}
                          className="d-block text-white"
                          href={`room/${item.url_key ?? item.room_url_key}/${item.id ?? item.room_id}`}
                        >
                          <h5 className="d-inline">
                            {item.room_url_key
                              .replace('_', ' ')
                              .replace('JKT48', '') + ' JKT48'}{' '}
                          </h5>
                          <h6 className="d-inline" style={{ color: '#ced4da' }}>
                            {getTimes(item.started_at)}
                          </h6>
                        </Button>
                      </div>
                    </Fade>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-12 mt-5 text-center">
                <IoVideocamOff size={100} />
                <h3 className="mt-3">Room Live Not Found</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    ) : isOnLive ? (
      <div className="container">
        <div className="row">
          <div className="col-12 mt-5 text-center">
            <IoVideocamOff size={100} />
            <h3 className="mt-3">Room Live Not Found</h3>
          </div>
        </div>
      </div>
    ) : ''
  );
}