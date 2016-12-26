using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities;
using System;
using System.Net;

namespace Intel.MyDeals.Controllers.API
{
    //TODO: Once security is implemented, we want to add it to these api controllers to ensure only the correct users are allowed to get geo information?
    [RoutePrefix("api/Geos")]
    public class GeosController : BaseApiController
    {
        /// <summary>
        ///
        /// </summary>
        /// <param name="getCachedResult">When set to false read request is coming from Admin screens</param>
        /// <returns></returns>
        [Authorize]
        [Route("GetGeos/{getCachedResult:bool?}")]
        public IEnumerable<GeoDimension> GetGeoDimensions(bool getCachedResult = true)
        {
            try
            {
                return new GeosLib().GetGeoDimensions(getCachedResult);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetGeo/{sid}")]
        public GeoDimension GetGeoDimension(int sid)
        {
            try
            {
                return new GeosLib().GetGeoDimension(sid);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetActiveGeos")]
        public IEnumerable<GeoDimension> GetActiveGeos()
        {
            try
            {
                return new GeosLib().GetGeoDimensionsActive();
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetGeoByGeoName/{name}")]
        public IEnumerable<GeoDimension> GetGeoByGeoName(string name)
        {
            try
            {
                return new GeosLib().GetGeoDimensionByGeoName(name);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetGeoByGeoSid/{sid}")]
        public IEnumerable<GeoDimension> GetGeoByGeoSid(int sid)
        {
            try
            {
                return new GeosLib().GetGeoDimensionByGeoSid(sid);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetGeoByRegionName/{name}")]
        public IEnumerable<GeoDimension> GetGeoByRegionName(string name)
        {
            try
            {
                return new GeosLib().GetGeoDimensionByRegionName(name);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetGeoByRegionSid/{sid}")]
        public IEnumerable<GeoDimension> GetGeoByRegionSid(int sid)
        {
            try
            {
                return new GeosLib().GetGeoDimensionByRegionSid(sid);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetGeoByCountryName/{name}")]
        public IEnumerable<GeoDimension> GetGeoByCountryName(string name)
        {
            try
            {
                return new GeosLib().GetGeoDimensionByCountryName(name);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("GetGeoByCountrySid/{sid}")]
        public IEnumerable<GeoDimension> GetGeoByCountrySid(int sid)
        {
            try
            {
                return new GeosLib().GetGeoDimensionByCountrySid(sid);
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

    }
}
