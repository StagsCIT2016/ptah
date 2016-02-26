# coding: utf-8
# pylint: disable=too-few-public-methods, no-self-use, missing-docstring, unused-argument
"""
Provides API logic relevant to positions
"""
from flask_restful import reqparse, Resource

import auth
import util

from main import API
from model import Position
from api.helpers import ArgumentValidator, make_list_response, make_empty_ok_response
from flask import request, g
from pydash import _
from api.decorators import model_by_key



@API.resource('/api/v1/positions')
class PositionsAPI(Resource):
    """Gets list of positions. Uses ndb Cursor for pagination. Obtaining positions is executed
    in parallel with obtaining total count via *_async functions
    """

    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('cursor', type=ArgumentValidator.create('cursor'))
        args = parser.parse_args()

        positions_future = Position.query() \
            .order(-Position.created) \
            .fetch_page_async(10, start_cursor=args.cursor)

        total_count_future = Position.query().count_async(keys_only=True)
        positions, next_cursor, more = positions_future.get_result()
        positions = [u.to_dict(include=Position.get_public_properties()) for u in positions]
        return make_list_response(positions, next_cursor, more, total_count_future.get_result())

    def post(self):
        """Post position"""
        # properties = ["id_", "created_at", "title", "location", "type_", "description",
        #                     "how_to_apply", "company", "company_url", "company_logo", "url"]

        parser = reqparse.RequestParser()
        args = parser.parse_args()

        position_db = Position (
            title = request.json['title'],
            location = request.json['location'],
            type_ = request.json['type_'],
            description = request.json['description'],
            how_to_apply = request.json['how_to_apply'],
            company = request.json['company'],
            company_url = request.json['company_url'],
            company_logo = request.json['company_logo'],
            url = request.json['url']
        )
        position_db.put()
        position = position_db.to_dict(include=Position.get_public_properties())

        # positions_db = [u.to_dict(include=Position.get_public_properties()) for u in positions_db]

        # g.model_db.put()
        return position, 201

        # properties = ["id_", "created_at", "title", "location", "type_", "description",
        #                     "how_to_apply", "company", "company_url", "company_logo", "url"]
        #
        # positions = [u.to_dict(include=Position.get_public_properties()) for u in positions]
        #
        # new_data = _.pick(request.json, properties)
        # g.model_db.populate(**new_data)
        # g.model_db.put()
        # return make_empty_ok_response()


@API.resource('/api/v1/positions/<string:key>')
class PositionByKeyAPI(Resource):
    # @authorization_required
    @model_by_key
    def put(self, key):
        """Updates positions's properties"""
        update_properties = [ "title", "location", "type_", "description",
                            "how_to_apply", "company", "company_url", "company_logo", "url"]

        new_data = _.pick(request.json, update_properties)
        g.model_db.populate(**new_data)
        g.model_db.put()
        return new_data, 200

    # @admin_required
    @model_by_key
    def delete(self, key):
        """Deletes position"""
        g.model_key.delete()
        return make_empty_ok_response()
