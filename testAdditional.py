"""
Additional Functional Tests
"""

import unittest
import os
import testLib

SUCCESS               =   1  # : a success
ERR_BAD_CREDENTIALS   =  -1  # : (for login only) cannot find the user/password pair in the database
ERR_USER_EXISTS       =  -2  # : (for add only) trying to add a user that already exists
ERR_BAD_USERNAME      =  -3  # : (for add, or login) invalid user name (only empty string is invalid for now)
ERR_BAD_PASSWORD      =  -4  # : (for add, or login) invalid password (over 128 characters)


class TestLoginUser(testLib.RestTestCase):
    """Test logging in user"""
    def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.SUCCESS):
        """
        Check that the response data dictionary matches the expected values
        """
        expected = { 'errCode' : errCode }
        if count is not None:
            expected['count']  = count
        self.assertDictEqual(expected, respData)

    def testLogin1(self):
        """
        Test logging in one user works
        """
        self.makeRequest("/users/add", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        self.assertResponse(respData, count = 2)

    def testLogin2(self):
        """
        Test logging in two users works
        """
        self.makeRequest("/users/add", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        self.makeRequest("/users/add", method="POST", data = { 'user' : 'user2', 'password' : 'password'} )
        respData1 = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        respData2 = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user2', 'password' : 'password'} )
        self.assertResponse(respData1, count = 2)
        self.assertResponse(respData2, count = 2)

    def testLoginThreeTimes(self):
        """
        Test logging in one user three times returns the correct count
        """
        self.makeRequest("/users/add", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        self.assertResponse(respData, count = 4)
    
    def testLoginBadCredentials(self):
        """
        Test logging in with bad credentials fails
        """
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        self.assertResponse(respData, count = None, errCode = ERR_BAD_CREDENTIALS)
    

class TestAddUser(testLib.RestTestCase):
    """Test adding user testcases"""
    def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.SUCCESS):
        """
        Check that the response data dictionary matches the expected values
        """
        expected = { 'errCode' : errCode }
        if count is not None:
            expected['count']  = count
        self.assertDictEqual(expected, respData)

    def testAdd2(self):
        """
        Test adding two users works
        """
        respData1 = self.makeRequest("/users/add", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        respData2 = self.makeRequest("/users/add", method="POST", data = { 'user' : 'user2', 'password' : 'password'} )
        self.assertResponse(respData1, count = 1)
        self.assertResponse(respData2, count = 1)

    def testAddEmptyName(self):
        """
        Test adding a user with an empty username fails
        """
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : '', 'password' : 'password'} )
        self.assertResponse(respData, count = None, errCode = ERR_BAD_USERNAME)

class TestResetFixture(testLib.RestTestCase):
    """Test adding user testcases"""
    def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.SUCCESS):
        """
        Check that the response data dictionary matches the expected values
        """
        expected = { 'errCode' : errCode }
        if count is not None:
            expected['count']  = count
        self.assertDictEqual(expected, respData)

    def testResetFixture(self):
        """
        Test resetFixture to return success
        """
        respData = self.makeRequest("/TESTAPI/resetFixture", method="POST", data = {} )
        self.assertResponse(respData, count = None, errCode = SUCCESS)

