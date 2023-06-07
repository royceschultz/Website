def many(parser):
    def parseMany(parsed, remainder):
        print("Parsing Many", parser.__name__)
        new_parsed = []
        new_remainder = remainder
        while True:
            new_parsed, new_remainder, success = parser(new_parsed, new_remainder)
            if not success:
                break
        if not new_parsed:
            return parsed, remainder, False
        return parsed + [new_parsed], new_remainder, True
    return parseMany

def then(*parsers):
    def parseThen(parsed, remainder):
        new_parsed = []
        new_remainder = remainder
        for parser in parsers:
            new_parsed, new_remainder, success = parser(new_parsed, new_remainder)
            if not success:
                return parsed, remainder, False
            new_parsed.append(parsed)
        return parsed + new_parsed, new_remainder, True
    return parseThen

def tryParser(parser):
    def parseTry(parsed, remainder):
        new_parsed, new_remainder, success = parser(parsed, remainder)
        if not success:
            return parsed, remainder, False
        return parsed + new_parsed, new_remainder, True
    return parseTry


class iByte:
    def __init__(self, byte):
        self.byte = byte

    def __str__(self):
        return str(self.byte)

    def __repr__(self):
        return str(self)


class iBytes:
    def __init__(self, ibytes):
        self.bytes = ibytes

    def getBytes(self):
        out = bytearray()
        for byte in self.bytes:
            out.extend(byte.byte)
        return out

    def __str__(self):
        return str(self.getBytes())

    def __repr__(self):
        return str(self.getBytes())


def byteParser():
    def parseByte(parsed, remainder):
        if not remainder:
            return parsed, remainder, False
        else:
            return parsed + [iByte(remainder[0].to_bytes())], remainder[1:], True
    return tryParser(parseByte)


def bytesParser(n):
    def parseBytes(parsed, remainder):
        parsed_bytes = []
        for i in range(n):
            parsed, remainder, success = byteParser()(parsed, remainder)
            if not success:
                return parsed, remainder, False
        assert len(parsed) == n
        return parsed + [iBytes(new_parsings)], new_remainder, True

    return parseBytes

def STLParser():
    def parseSTL(parsed, remainder):
        # parsed, remainder, success = then(headerParser(), triangleParser())(parsed, remainder)
        parser = then(bytesParser(80), bytesParser(4), many(bytesParser(50)))
        new_parsed, new_remainder, success = parser(parsed, remainder)
        if not success:
            return parsed, remainder, False
        print('done')
        print(len(new_parsed))
        for x in new_parsed:
            print(x)
        assert len(new_parsed) == 3
        return parsed, remainder, True

    return parseSTL


with open('test.stl', 'rb') as f:
    parser = STLParser()
    parsed, remainder, success = parser([], f.read())
    print('done')
    for x in parsed:
        print(x)
