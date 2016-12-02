using System.Collections.Generic;
using System.Web.Http;
using Intel.MyDeals.BusinesssLogic;
using Intel.MyDeals.Entities;
using Intel.Opaque;
using System;
using System.Net;

namespace Intel.MyDeals.Controllers.API
{
    //TODO: Once security is implemented, we want to add it to these api controllers to ensure only the correct users are allowed to get geo information?
    public class GeosController : ApiController
    {
        OpCore op = OpAppConfig.Init();

        [Authorize]
        [Route("api/Geos/GetGeos")]
        public IEnumerable<GeoDimension> GetGeoDimensions()
        {
            try
            {
                return new GeosLib().GetGeoDimensions();
            }
            catch (Exception ex)
            {
                OpLog.HandleException(ex);
                throw new HttpResponseException(HttpStatusCode.InternalServerError);  //responds with a simple status code for ajax call to consume.
            }
        }

        [Authorize]
        [Route("api/Geos/GetGeo")]
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
        [Route("api/Geos/GetActiveGeos")]
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
        [Route("api/Geos/GetGeoByGeoName")]
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
        [Route("api/Geos/GetGeoByGeoSid")]
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
        [Route("api/Geos/GetGeoByRegionName")]
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
        [Route("api/Geos/GetGeoByRegionSid")]
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
        [Route("api/Geos/GetGeoByCountryName")]
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
        [Route("api/Geos/GetGeoByCountrySid")]
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
