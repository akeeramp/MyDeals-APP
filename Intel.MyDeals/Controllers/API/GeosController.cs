using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.Opaque;
using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;

namespace Intel.MyDeals.Controllers.API
{
    //TODO: Once security is implemented, we want to add it to these api controllers to ensure only the correct users are allowed to get geo information?
    [RoutePrefix("api/Geos")]
    public class GeosController : BaseApiController
    {
        private readonly IGeosLib _geosLib;

        public GeosController(IGeosLib _geosLib)
        {
            this._geosLib = _geosLib;
        }

        /// <summary>
        /// Get Geo Dimensions
        /// </summary>
        /// <param name="getCachedResult">When set to false read request is coming from Admin screens</param>
        /// <returns></returns>
        [Authorize]
        [Route("GetGeos/{getCachedResult:bool?}")]
        public IEnumerable<GeoDimension> GetGeoDimensions(bool getCachedResult = true)
        {
            try
            {
                return _geosLib.GetGeoDimensions(getCachedResult);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetGeo/{sid}")]
        public GeoDimension GetGeoDimension(int sid)
        {
            try
            {
                return _geosLib.GetGeoDimension(sid);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetActiveGeos")]
        public IEnumerable<GeoDimension> GetActiveGeos()
        {
            try
            {
                return _geosLib.GetGeoDimensionsActive();
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetGeoByGeoName/{name}")]
        public IEnumerable<GeoDimension> GetGeoByGeoName(string name)
        {
            try
            {
                return _geosLib.GetGeoDimensionByGeoName(name);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetGeoByGeoSid/{sid}")]
        public IEnumerable<GeoDimension> GetGeoByGeoSid(int sid)
        {
            try
            {
                return _geosLib.GetGeoDimensionByGeoSid(sid);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetGeoByRegionName/{name}")]
        public IEnumerable<GeoDimension> GetGeoByRegionName(string name)
        {
            try
            {
                return _geosLib.GetGeoDimensionByRegionName(name);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetGeoByRegionSid/{sid}")]
        public IEnumerable<GeoDimension> GetGeoByRegionSid(int sid)
        {
            try
            {
                return _geosLib.GetGeoDimensionByRegionSid(sid);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetGeoByCountryName/{name}")]
        public IEnumerable<GeoDimension> GetGeoByCountryName(string name)
        {
            try
            {
                return _geosLib.GetGeoDimensionByCountryName(name);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetGeoByCountrySid/{sid}")]
        public IEnumerable<GeoDimension> GetGeoByCountrySid(int sid)
        {
            try
            {
                return _geosLib.GetGeoDimensionByCountrySid(sid);
            }
            catch (Exception ex)
            {
                OpLogPerf.Log(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }
    }
}